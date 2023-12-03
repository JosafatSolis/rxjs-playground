import { Observable, Subscriber } from 'rxjs';

const someObservable$ = new Observable<string>(subscriber => {
  subscriber.next('Alice');
  subscriber.next('Ben');
  subscriber.next('Charlie');
  subscriber.complete();
});

someObservable$.subscribe(value => console.log(value));

// Notas que el observer recibido se convierte en el subscriber dentro del Observable.
// Notar que el observable, "manipula" el objeto observer recibido (el subscriber) y ejecuta los métodos que quiera de él (next, error, complete)

const observable$ = new Observable((subscriber: Subscriber<unknown>) => {
  console.log('\nOperación independiente...');
  subscriber.next('param1');
  // subscriber.complete();
  subscriber.next('param2');

  setTimeout(() => subscriber.next('A los 2k'), 2000);
  setTimeout(() => subscriber.next('A los 4k'), 4000);

  // subscriber.error('condiciones incorrectas'); // Ejecuta lo mismo que la siguiente línea
  throw new Error('condiciones incorrectas'); // Ejecuta lo mismo que la línea anterior
  subscriber.next('No llega aquí...');
});

// Versión completa, se define el next, error y complete como funciones con firmas específicas, dentro de la definición del observer
const observer1 = {
  next: (param: any) => {
    let tmp = param + ' y algo más...';
    console.log(tmp);
  },
  error: (err: any) => {
    // throw new Error('Un error: ' + err); // Ver si es posible/necesario levantar un error aquí
    console.error('Un error: ' + err);
  },
  complete: () => {
    console.log('Terminado.');
  },
};

// Versión corta, la función por default es el next. Si dentro el del observer se ejecutan error o complete, se comporta igual como si se declarara la versión completa y ya no continúa recibiendo.
const observer2 = (param: any) => {
  let tmp = param + ' y algo más... (observer2)';
  console.log(tmp);
};

const ref1 = observable$.subscribe(observer1);
observable$.subscribe(observer2);
observable$.subscribe((param) => {
  console.log(param + ' y algo más...');
});
observable$.subscribe(
  (param: any) => {
    console.log(param);
  },
  (err: any) => {
    console.error(err);
  },
  () => {
    console.log('Terminado.');
  }
); // Firma Obsoleta
// observable$.subscribe('algo'); --> marca error porque sólo se reciben 3 tipos de parámetros (arriba)

setTimeout(() => {
  console.log('Unsubscribe');
  ref1.unsubscribe();
}, 3000);