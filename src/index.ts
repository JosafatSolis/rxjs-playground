import { Observable, Subscriber, from, of, fromEvent, timer, forkJoin, map } from 'rxjs';
import { AjaxResponse, ajax } from 'rxjs/ajax';

const triggerButton = document.querySelector('button#trigger');

const tempInput = document.querySelector('#temp-input');
const conversionDD = document.querySelector('#conversion-dd') as HTMLSelectElement;
const outText = document.querySelector('#result-text');

const inputChange$ = fromEvent<InputEvent>(tempInput, 'input');
const conversionChange = fromEvent(conversionDD, 'input');


inputChange$.subscribe(event => console.log(event.data));
conversionChange.subscribe(event => console.log(conversionDD.value));

