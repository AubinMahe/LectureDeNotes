'use strict';

const URL_BASE  = "http://localhost/~aubin/LectureDeNotes/";
const { JSDOM } = require("jsdom");

// workaround because JSDOM.fromURL terminate too early, before the embedded scripts are executed.
async function delay( ms ) {
   return new Promise( resolve => setTimeout( resolve, ms ));
}

var window          = null;
var document        = null;
var iLectureDeNotes = null;

beforeAll( async () => {
   const dom = await JSDOM.fromURL( URL_BASE + "index.html", {
      resources : 'usable',
      runScripts: 'dangerously',
   });
   // Waiting for scripts to be loaded and executed
   await delay( 300 );
   window          = dom.window;
   document        = dom.window.document;
   iLectureDeNotes = dom.window.iLectureDeNotes;
   if( typeof iLectureDeNotes === 'undefined' ) {
      throw "too short timeout!";
   }
});

test('Comportement de la case à cocher "Activer l\'aide sur le clavier"', () => {
   let with_kbd_help = document.getElementById('avec-l-aide');
   let img_kbd       = document.getElementById('clavier');

   expect( with_kbd_help.checked ).toBeFalsy();
   expect( img_kbd.src           ).toBe ( URL_BASE + 'clavier-sans-aide.jpg' );
   expect( document.cookie       ).toMatch( /avec-l-aide=false/ );

   with_kbd_help.click();
   expect( with_kbd_help.checked ).toBeTruthy();
   expect( img_kbd.src           ).toBe ( URL_BASE + 'clavier.jpg' );
   expect( document.cookie       ).toMatch( /avec-l-aide=true/ );
});

afterAll(() => {
   window.close();
});
