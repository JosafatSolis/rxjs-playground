import { Observable, Subscriber } from 'rxjs';

/////////////// SERIE 1 ////////////////

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



  /////////////// SERIE 2 ////////////////

  // import { Observable, Subscriber } from 'rxjs';

  let Obs$ = new Observable<String>((subscriber: Subscriber<any>) => {
    subscriber.next('Hello World');
    let ref1 = setTimeout(() => {
      subscriber.next('Hello again');
      console.log('Código que sí se ejecuta si no se cancela!!!');
      subscriber.complete();
    }, 3000);
  
    setTimeout(() => subscriber.error('Error description'), 2000);
  
    return () => {
      console.log('Teardown code executed when Complete, Error or Unsusbcribe.');
      clearInterval(ref1); // Evita que el código del timeout se ejecute después (Memmory Leaks)
    }
  });
  
  let unObserver = {
    next: (data: String) => console.log('data: ', data),
    complete: () => console.log('Completed!'),
    error: (err: any) => console.log(err)
  }
  
  let ref2 = Obs$.subscribe(unObserver);
  
  //ref.unsubscribe(); // Hace que el código dentro del setTimeout no se alcance a ejecutar.
  

/////////////// SERIE 3 ////////////////

import { fromEvent, timer, interval } from 'rxjs';

const triggerButton = document.querySelector('button#trigger');

const obs1$ = fromEvent<MouseEvent>(triggerButton, 'click');
const obs2$ = timer(1000);
const obs3$ = interval(3000);
const obs4$ = timer(10000);

obs1$.subscribe(event => {
  obs2$.subscribe(value => console.log(value, event.type, event.x, event.y))
});

obs1$.subscribe(event => {
  const ref = obs3$.subscribe(value => console.log('interval ', value + 1, event.type, event.x, event.y));
  obs4$.subscribe(() => ref.unsubscribe());
})



/////////////// SERIE 3 ////////////////

import { forkJoin, map } from 'rxjs';

const triggerButton_ = document.querySelector('button#trigger');

const obs1$_ = fromEvent<MouseEvent>(triggerButton_, 'click');

obs1$_.subscribe(event => {
  let arr: Observable<number>[] = [];
  for (let i = 0; i < 2; i++) {
    let tiempo = Math.floor(Math.random() * 10000);
    arr = arr.concat(timer(tiempo).pipe(map(v => tiempo)));
  }
  forkJoin(arr).subscribe((values) => {
    console.log('forkJoinCompleted', values);
  })
})

/////////////// SERIE 4 ////////////////
import { ajax } from 'rxjs/ajax';


obs1$.subscribe(event => {
  const name = ajax<any>('https://random-data-api.com/api/name/random_name');
  const nation = ajax<any>('https://random-data-api.com/api/nation/random_nation');
  const food = ajax<any>('https://random-data-api.com/api/food/random_food');
  // name.subscribe(response => console.log(response.response.first_name));
  // Forma 1 de hacerlo:
  // forkJoin([name, nation, food]).subscribe((values: AjaxResponse<any>[]) => {
  //   console.log(`${values[0].response.first_name} is from ${values[1].response.capital} and likes to eat ${values[2].response.dish}`);
  // });
  // Forma 2 de hacerlo:
  forkJoin([name, nation, food]).subscribe(([nameResponse, nationResponse, foodResponse]) => {
    console.log(`${nameResponse.response.first_name} is from ${nationResponse.response.capital} and likes to eat ${foodResponse.response.dish}`);
  })
})