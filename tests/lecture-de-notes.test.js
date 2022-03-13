'use strict';

const URL_BASE  = "http://localhost/~aubin/LectureDeNotes/";
const { JSDOM } = require("jsdom");

// workaround because JSDOM.fromURL terminate too early, before the embedded scripts are executed.
async function delay( ms ) {
   return new Promise( resolve => setTimeout( resolve, ms ));
}

function check( val, ref ) {
   if( val == ref ) {
      console.log( "PASS" );
   }
   else {
      console.log( "FAIL, " + val + " observed, " + ref + " expected" );
   }
}

function match( str, regex ) {
   if( str.match( regex )) {
      console.log( "PASS" );
   }
   else {
      console.log( "FAIL, '" + str + "' doesn't match '" + regex + "'" );
   }
}

async function tests() {
   const dom = await JSDOM.fromURL( URL_BASE + "index.html", {
      resources : 'usable',
      runScripts: 'dangerously',
   });
   // Waiting for scripts to be loaded and executed
   await delay( 300 );
   const window          = dom.window;
   const document        = dom.window.document;
   const iLectureDeNotes = dom.window.iLectureDeNotes;
   if( typeof iLectureDeNotes === 'undefined' ) {
      throw "too short timeout!";
   }
   console.log( "Page loaded" );

   console.log('Comportement de la case à cocher "Activer l\'aide sur le clavier"');
   let with_kbd_help = document.getElementById('avec-l-aide');
   let img_kbd       = document.getElementById('clavier');
   
   check( with_kbd_help.checked, false );
   check( img_kbd.src          , URL_BASE + 'clavier-sans-aide.jpg' );
   match( document.cookie      , /avec-l-aide=false/ );
   
   with_kbd_help.click();
   iLectureDeNotes.toto();
   check( with_kbd_help.checked, true );
   check( img_kbd.src          , URL_BASE + 'clavier.jpg' );
   match( document.cookie      , /avec-l-aide=true/ );
   
   window.close();
}

tests();
