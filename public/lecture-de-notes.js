class LectureDeNotes {
   
   #count          = document.getElementById('note-count');
   #interval       = document.getElementById('time-interval');
   #with_names     = document.getElementById('with-names');
   #round          = document.getElementById('round');
   #start          = document.getElementById('start');
   #portées        = document.getElementById('portées');
   #clavier        = document.getElementById('clavier');
   #note           = document.getElementById('note');
   #diese          = document.getElementById('diese');
   #timer_id       = -1;
   #previous_index = -1;

   constructor() {
      this.#note.style.left = ( this.#portées.offsetLeft + 200 ) + "px";
      this.#note.style.top  = ( this.#portées.offsetTop + 4 - ( 4 - 6 ) * 6.5 ) + "px";
      this.#clavier.addEventListener('click', event => this.#show_note( event ));
      this.#with_names.addEventListener('click', () => this.#toggle_display_note_names());
      this.#start.addEventListener('click', () => {
         if( this.#timer_id == -1 ) {
            let interval = parseInt( this.#interval.value );
            console.log( "starting test with interval = " + interval );
            this.#timer_id = setInterval(() => this.#display_note(), interval );
            this.#display_note();
         }
         else {
            console.log( "interrupting test" );
            clearInterval( this.#timer_id );
            this.#timer_id           = -1;
            this.#round.value        =  1;
            this.#note.style.display = 'none';
         }
      });
   }
   
   #show_note( event ) {
      let x = event.clientX - this.#clavier.offsetLeft;
      let y = event.clientY - this.#clavier.offsetTop;
      console.log( "x, y: " + x + ", " + y );
      let index      = Math.floor( x / 75 );
      let alteration = false;
      if( y < 200 ) {
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
      console.log( "index: " + index );
      this.#note.style.left    = ( this.#portées.offsetLeft + 200 ) + "px";
      this.#note.style.top     = ( this.#portées.offsetTop + 4 - ( index - 6 ) * 6.5 ) + "px";
      this.#note.style.display = 'block';
      console.log( "note.top: " + this.#note.style.top );
      if( alteration ) {
         this.#diese.style.display = 'block';
      }
      else {
         this.#diese.style.display = 'none';
      }
   }

   #display_note() {
      let clef  = Math.round( Math.random() *  2.0 );
      if( clef > 1 ) {
         clef = 1;
      }
      let index = this.#previous_index;
      while( index == this.#previous_index ) {
         index = Math.round( Math.random() * 14.0 );
      }
      if( index > 13 ) {
         index = 13;
      }
      this.#previous_index = index;
      console.log( "index: " + index );
      this.#note.style.left    = ( this.#portées.offsetLeft + 200 ) + "px";
      this.#note.style.top     = ( this.#portées.offsetTop + 4 - ( index - 6 ) * 6.5 ) + "px";
      this.#note.style.display = 'block';
      let round = parseInt( this.#round.value );
      let count = parseInt( this.#count.value );
      if( ++round > count ) {
         console.log( "ending test" );
         clearInterval( this.#timer_id );
         this.#timer_id           = -1;
         this.#round.value        =  1;
         this.#note.style.display = 'none';
      }
      else {
         this.#round.value = round;
      }
   }
   
   #toggle_display_note_names() {
      if( this.#with_names.checked ) {
         this.#clavier.src = 'clavier.jpg';
      }
      else {
         this.#clavier.src = 'clavier-sans-aide.jpg';
      }
   }
}

new LectureDeNotes();
