const NOTES = ["Do", "Ré", "Mi", "Fa", "Sol", "La", "Si"];

class LectureDeNotes {
   
   #avec_l_aide                = document.getElementById('avec-l-aide');
   #démarrer                   = document.getElementById('démarrer');
   #portées                    = document.getElementById('portées');
   #clavier                    = document.getElementById('clavier');
   #note                       = document.getElementById('note');
   #diese                      = document.getElementById('diese');
   #nbr_de_notes_decodées      = document.getElementById('nbr-de-note-decodée');
   #nbr_d_erreurs              = document.getElementById('nombre-d-erreurs');
   #temps_de_lecture           = document.getElementById('temps-de-lecture');
   #correction                 = document.getElementById('correction');
   #somme_des_temps_de_lecture = 0;
   #clef_de_sol                = true;
   #index                      = -1;
   #alteration                 = false;
   #previous_index             = -1;
   #instant_de_la_question     = 0;
//   #tests                      = 0;

   constructor() {
      this.#avec_l_aide.checked = document.cookie.split(';').some(item => item.includes('avec-l-aide=true'))
      this.#avec_l_aide.addEventListener('click', ()    => this.#affiche_le_clavier());
      this.#clavier    .addEventListener('click', event => this.#note_selected( event ));
      this.#correction .addEventListener('click', ()    => this.#display_note());
      this.#démarrer   .addEventListener('click', ()    => this.#lancer_la_lecture());
      this.#affiche_le_clavier();
   }

   #lancer_la_lecture() {
//      this.#tests                       = 0;
      this.#nbr_de_notes_decodées.value = "0";
      this.#nbr_d_erreurs        .value = "0";
      this.#temps_de_lecture     .value = "0";
      this.#display_note();
   }
   
   
   #note_selected( event ) {
      let nbr_de_notes_decodées = parseInt( this.#nbr_de_notes_decodées.value ) + 1;
      this.#somme_des_temps_de_lecture += Date.now() - this.#instant_de_la_question;
      this.#nbr_de_notes_decodées.value = nbr_de_notes_decodées;
      this.#temps_de_lecture     .value = "" + ( this.#somme_des_temps_de_lecture / nbr_de_notes_decodées / 1000 ).toFixed(1);
      let x = event.clientX - this.#clavier.offsetLeft;
      let y = event.clientY - this.#clavier.offsetTop;
      let index      = Math.floor( x / 75 );
      let alteration = false;
      if( y < 109 ) {
         if(( 49 < x )&&( x < 49+58 )) {
            // Do#
            index      = 0;
            alteration = true;
         }
         else if(( 123 < x )&&( x < 123+58 )) {
            // Ré#
            index      = 1;
            alteration = true;
         }
         else if(( 272 < x )&&( x < 272+58 )) {
            // Fa#
            index      = 3;
            alteration = true;
         }
         else if(( 347 < x )&&( x < 347+58 )) {
            // Sol#
            index      = 4;
            alteration = true;
         }
         else if(( 421 < x )&&( x < 421+58 )) {
            // La#
            index      = 5;
            alteration = true;
         }
      }
      if( ! this.#clef_de_sol ) {
         this.#index += 2;
      }
      this.#index %= 7;
      if(( this.#index == index )&&( this.#alteration == alteration )) {
         this.#display_note();
      }
      else {
         console.log("index attendu : " + this.#index);
         console.log("index observé : " + index);
         console.log("alteration attendue : " + this.#alteration);
         console.log("alteration observée : " + alteration);
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

   #display_note() {
      this.#note .style.left = ( this.#portées.offsetLeft + 200 ) + "px";
      this.#diese.style.left = ( this.#portées.offsetLeft + 186 ) + "px";
      this.#correction.style.display = 'none';
      this.#clef_de_sol = ( Math.random() > 0.5 );
      this.#index       = this.#previous_index;
      while( this.#index == this.#previous_index ) {
         this.#index = Math.round( Math.random() * 14.0 );
      }
      if( this.#index > 13 ) {
         this.#index = 13;
      }
      this.#previous_index = this.#index;
      this.#alteration     = ( Math.random() > 0.5 );
/*
this.#clef_de_sol = false;
this.#index       = this.#tests++;
this.#alteration  = true;
this.#tests %= 14;
*/
      if( this.#clef_de_sol ) {
         this.#note .style.top = ( this.#portées.offsetTop +   4 - ( this.#index - 6 ) * 6.5 ) + "px";
         this.#diese.style.top = ( this.#portées.offsetTop +  34 - ( this.#index - 6 ) * 6.5 ) + "px";
         if(( this.#index == 2 )||( this.#index == 6 )||( this.#index == 9 )||( this.#index == 13 )) {
            this.#alteration = false;
         }
         console.log( NOTES[this.#index % 7] + ( this.#alteration ? "#" : "" ));
      }
      else {
         this.#note .style.top = ( this.#portées.offsetTop +  70 - ( this.#index - 11 ) * 6.5 ) + "px";
         this.#diese.style.top = ( this.#portées.offsetTop + 100 - ( this.#index - 11 ) * 6.5 ) + "px";
         if(( this.#index == 0 )||( this.#index == 4 )||( this.#index == 7 )||( this.#index == 11 )) {
            this.#alteration = false;
         }
         console.log( NOTES[( this.#index + 2 ) % 7] + ( this.#alteration ? "#" : "" ));
      }
      this.#note .style.display = 'block';
      this.#diese.style.display = this.#alteration ? 'block' : 'none';
      this.#instant_de_la_question = Date.now();
   }
   
   #affiche_le_clavier() {
      if( this.#avec_l_aide.checked ) {
         this.#clavier.src = 'clavier.jpg';
      }
      else {
         this.#clavier.src = 'clavier-sans-aide.jpg';
      }
      document.cookie = 'avec-l-aide='+this.#avec_l_aide.checked + "; SameSite=Lax; expires=Fri, 1 Jan 2100 12:00:00 UTC";
   }
}

new LectureDeNotes();
