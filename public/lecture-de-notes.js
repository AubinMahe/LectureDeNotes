/* 
    Outil pédagogique de lecture de notes en clef de Fa et clef de Sol.
    
    Copyright (C) 2022 Aubin MAHE

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
    
    See LICENCE file in the directory of this file.
*/
const NOTES           = ['Do'      ,'Ré'      ,'Mi','Fa'      ,'Sol'       ,'La'      ,'Si'];
const NOTES_ALTER     = ['Do','Do#','Ré','Ré#','Mi','Fa','Fa#','Sol','Sol#','La','La#','Si'];
const TEST            = false;
const TEST_ALTERATION = false;

class Selection {

   index      = 0
   alteration = false;
   
   constructor( x, y ) {
      this.index      = Math.floor( x / 75 );
      this.alteration = false;
      if( y < 109 ) {
         if(( 49 < x )&&( x < 49+58 )) {
            // Do#
            this.index      = 0;
            this.alteration = true;
         }
         else if(( 123 < x )&&( x < 123+58 )) {
            // Ré#
            this.index      = 1;
            this.alteration = true;
         }
         else if(( 272 < x )&&( x < 272+58 )) {
            // Fa#
            this.index      = 3;
            this.alteration = true;
         }
         else if(( 347 < x )&&( x < 347+58 )) {
            // Sol#
            this.index      = 4;
            this.alteration = true;
         }
         else if(( 421 < x )&&( x < 421+58 )) {
            // La#
            this.index      = 5;
            this.alteration = true;
         }
      }
   }
}

class LectureDeNotes {

   #avec_l_aide                = document.getElementById('avec-l-aide');
   #démarrer                   = document.getElementById('démarrer-terminer');
   #portées                    = document.getElementById('portées');
   #clavier                    = document.getElementById('clavier');
   #note                       = document.getElementById('note');
   #trait                      = document.getElementById('trait');
   #diese                      = document.getElementById('diese');
   #nbr_de_notes_decodées      = document.getElementById('nbr-de-note-decodée');
   #nbr_d_erreurs              = document.getElementById('nombre-d-erreurs');
   #temps_de_lecture           = document.getElementById('temps-de-lecture');
   #correction                 = document.getElementById('correction');
   #bilan                      = document.getElementById('bilan');
   #somme_des_temps_de_lecture = 0;
   #clef_de_sol                = true;
   #index                      = -1;
   #alteration                 = false;
   #previous_index             = -1;
   #instant_de_la_question     = 0;
   #note_en_cours              = "";
   #exercice                   = [new Map(), new Map()];
   #tests                      = 0;

   constructor() {
      this.#avec_l_aide.checked = document.cookie.split(';').some(item => item.includes('avec-l-aide=true'))
      this.#avec_l_aide.addEventListener('click', ()    => this.#affiche_le_clavier());
      this.#clavier    .addEventListener('click', event => this.#note_selected( event ));
      this.#correction .addEventListener('click', ()    => this.#display_note(true));
      this.#démarrer   .addEventListener('click', ()    => this.#lancer_la_lecture_ou_terminer());
      this.#affiche_le_clavier();
   }

   #get_paire(clef_de_sol, note) {
      let clef  = this.#exercice[clef_de_sol ? 0 : 1];
      let paire = clef.get(note);
      if( paire == null ) {
         paire = {fautes:0, total:0};
         clef.set(note, paire);
      }
      return paire;
   }

   #cree_bilan(clef_de_sol, note_name) {
      let id    = note_name + '-en-' + ( clef_de_sol ? 'sol' : 'fa' );
      let td    = document.getElementById(id.toLowerCase());
      let paire = this.#get_paire(clef_de_sol, note_name);
      if( paire.total > 0 ) {
         let percent = (( 100 * (paire.total - paire.fautes)) / paire.total ).toFixed(1);
         td.innerHTML = "<strong>" + percent + " %</strong>";
         if( paire.fautes == 0 ) {
            td.style.backgroundColor = 'lightgreen';
         }
         else if( percent > 75 ) {
            td.style.backgroundColor = 'yellow';
         }
         else if( percent > 50 ) {
            td.style.backgroundColor = 'salmon';
         }
         else {
            td.style.backgroundColor = 'red';
         }
      }
      else {
         td.innerHTML = 'n.e.';
         td.style.backgroundColor = 'lightgray';
      }
   }

   #lancer_la_lecture_ou_terminer() {
      if( this.#note.style.display != 'block' ) {
         this.#démarrer.innerText = 'Terminer';
         this.#nbr_de_notes_decodées.value = "0";
         this.#nbr_d_erreurs        .value = "0";
         this.#temps_de_lecture     .value = "0";
         this.#tests                       = 0;
         this.#display_note(false);
      }
      else {
         this.#démarrer.innerText = 'Démarrer';
         this.#note      .style.display = 'none';
         this.#trait     .style.display = 'none';
         this.#diese     .style.display = 'none';
         this.#correction.style.display = 'none';
         for( let note_name of NOTES_ALTER ) {
            this.#cree_bilan(true , note_name);
            this.#cree_bilan(false, note_name);
         }
         this.#bilan.style.display = 'block';
         let body = document.getElementsByTagName('body')[0];
         let bilanBoundingClientRect = this.#bilan.getBoundingClientRect();
         this.#bilan.style.top  = (( body.clientHeight - bilanBoundingClientRect.height ) / 2 ) + 'px';
         this.#bilan.style.left = (( body.clientWidth  - bilanBoundingClientRect.width  ) / 2 ) + 'px';
//         this.#bilan.style.width  = body.getBoundingClientRect().height;
//         this.#bilan.style.height = body.getBoundingClientRect().width;
      }
   }
   
   #note_selected( event ) {
      if( this.#correction.style.display == 'block' ) {
         // Si une correction est en cours, ignorer l'action utilisateur.
         return;
      }
      let nbr_de_notes_decodées = parseInt( this.#nbr_de_notes_decodées.value ) + 1;
      this.#somme_des_temps_de_lecture += Date.now() - this.#instant_de_la_question;
      this.#nbr_de_notes_decodées.value = nbr_de_notes_decodées;
      this.#temps_de_lecture     .value = "" + ( this.#somme_des_temps_de_lecture / nbr_de_notes_decodées / 1000 ).toFixed(1);
      let x = event.clientX - this.#clavier.offsetLeft;
      let y = event.clientY - this.#clavier.offsetTop;
      let selection = new Selection( x, y );
      if( ! this.#clef_de_sol ) {
         this.#index += 2;
      }
      this.#index %= 7;
      if(( this.#index == selection.index )&&( this.#alteration == selection.alteration )) {
         let paire = this.#get_paire(this.#clef_de_sol, this.#note_en_cours);
         paire.total++;
         this.#display_note(false);
      }
      else {
//         console.log("index attendu : " + this.#index);
//         console.log("index observé : " + index);
//         console.log("alteration attendue : " + this.#alteration);
//         console.log("alteration observée : " + alteration);
         this.#nbr_d_erreurs.value = parseInt( this.#nbr_d_erreurs.value ) + 1;
         this.#correction.style.display = 'block';
         this.#correction.style.left = this.#clavier.offsetLeft + 10 + ( this.#index * 75 + ( this.#alteration ? 42 : 4 )) + 'px';
         if( this.#alteration ) {
            this.#correction.style.top = ( this.#clavier.offsetTop +  58 ) + 'px';
         }
         else {
            this.#correction.style.top = ( this.#clavier.offsetTop + 111 ) + 'px';
         }
      }
   }

   #randomly_elaborate_next_note() {
      var rnd = new Uint8Array(3);
      window.crypto.getRandomValues( rnd );
      this.#clef_de_sol = ( rnd[0] > 127 );
      this.#index       = this.#previous_index;
      while( this.#index == this.#previous_index ) {
         this.#index = Math.round(( 14.0 * rnd[1] ) / 256.0 );
         if( this.#index == this.#previous_index ) {
            window.crypto.getRandomValues( rnd );
         }
      }
      if( this.#index > 13 ) {
         this.#index = 13;
      }
      this.#alteration = ( rnd[2] > 127 );
      if( TEST ) {
         this.#alteration  = TEST_ALTERATION;
         this.#clef_de_sol = this.#tests < 14;
         this.#index       = this.#tests % 14;
         this.#tests++;
         this.#tests %= 28;
      }
      if( this.#clef_de_sol ) {
         if(( this.#index == 2 )||( this.#index == 6 )||( this.#index == 9 )||( this.#index == 13 )) {
            this.#alteration = false;
         }
         this.#note_en_cours = NOTES[this.#index % 7];
      }
      else {
         if(( this.#index == 0 )||( this.#index == 4 )||( this.#index == 7 )||( this.#index == 11 )) {
            this.#alteration = false;
         }
         this.#note_en_cours = NOTES[( this.#index + 2 ) % 7];
      }
      this.#note_en_cours += ( this.#alteration ? "#" : "" );
   }

   #display_note(validation_de_la_correction) {
      if( validation_de_la_correction ) {
         let paire = this.#get_paire(this.#clef_de_sol, this.#note_en_cours);
         paire.total++;
         paire.fautes++;
      }
      this.#note .style.left = ( this.#portées.offsetLeft + 200 ) + "px";
      this.#trait.style.left = ( this.#portées.offsetLeft + 190 ) + "px";
      this.#diese.style.left = ( this.#portées.offsetLeft + 186 ) + "px";
      this.#correction.style.display = 'none';
      this.#randomly_elaborate_next_note();
      this.#previous_index = this.#index;
      let ndx_trait = ( this.#index == 12 )||( this.#index == 13 ) ? 12 : 0;
      if( this.#clef_de_sol ) {
         this.#trait.style.top = ( this.#portées.offsetTop +  39 - ( ndx_trait   -  6 ) * 6.5 ) + "px";
         this.#note .style.top = ( this.#portées.offsetTop +   4 - ( this.#index -  6 ) * 6.5 ) + "px";
         this.#diese.style.top = ( this.#portées.offsetTop +  34 - ( this.#index -  6 ) * 6.5 ) + "px";
      }
      else {
         this.#trait.style.top = ( this.#portées.offsetTop + 105 - ( ndx_trait   - 11 ) * 6.5 ) + "px";
         this.#note .style.top = ( this.#portées.offsetTop +  70 - ( this.#index - 11 ) * 6.5 ) + "px";
         this.#diese.style.top = ( this.#portées.offsetTop + 100 - ( this.#index - 11 ) * 6.5 ) + "px";
      }
      console.log(this.#note_en_cours + " (" + this.#index + ")");
      this.#note .style.display = 'block';
      if(( this.#index < 1 )||( this.#index > 11 )) {
         this.#trait.style.display = 'block';
      }
      else {
         this.#trait.style.display = 'none';
      }
      this.#diese.style.display = this.#alteration ? 'block' : 'none';
      this.#instant_de_la_question = Date.now();
   }
   
   #affiche_le_clavier() {
//      console.log( '#affiche_le_clavier|this.#avec_l_aide.checked: ' + this.#avec_l_aide.checked );
      if( this.#avec_l_aide.checked ) {
         this.#clavier.src = 'clavier.jpg';
      }
      else {
         this.#clavier.src = 'clavier-sans-aide.jpg';
      }
      document.cookie = 'avec-l-aide='+this.#avec_l_aide.checked + "; SameSite=Lax; expires=Fri, 1 Jan 2100 12:00:00 UTC";
   }
}

// sonarqube says: Either remove this useless object instantiation of "LectureDeNotes" or use it.
var iLectureDeNotes = new LectureDeNotes(); // NOSONAR
