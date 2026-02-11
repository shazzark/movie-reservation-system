// npx ts-node index.ts
// const x = "daniel is coding";
// console.log("Hello, World!" + x);

// const a = 12;
// const b: number = 6;
// const c: number = 2;
// console.log(a / c);
// console.log(c * b);
// let myName: string = "Daniel";
// let MeaningOfLife: number;
// let isLoading: boolean;
// let album: number | string;
// let album2: any;

// myName = "chidozie";
// MeaningOfLife = 42;
// isLoading = true;
// album = 23;
// album2 = 3333;
// console.log(myName, MeaningOfLife, isLoading, album, album2);

// const sum = (a: number, b: number): number => {
//   return a + b;
// };

// let postId: string | number;
// let isActive: number | boolean;

// isActive = true;
// postId = number;

// let re: RegExp = /\w+/g;
// re = "danielk";
// console.log(postId, isActive, re);

// let stringArr = ["daniile", "key", "dave"];

// console.log(stringArr);

// stringArr[0] = "daniek";
// stringArr.push("42");
// // tuple
// let myTuple: [string, number, boolean] = ["dave ", 34, true];
// // object
// let myObj: object;
// myObj = [];
// console.log(myObj);

// myObj = bands;
// myObj = {};

// const exampleobj = {
//   prop1: "dave",
//   prop2: true,
// };

// exampleobj.prop1 = "john";

// interface guitarist {
//   name: string;
//   active?: boolean;
//   albums: (string | number)[];
// }

// let evh: guitarist = {
//   name: "daniel",
//   active: false,
//   albums: [12, 345, "ou812"],
// };

// let jp: guitarist = {
//   name: "jimmy",

//   albums: ["1 ", "ii", "iv"],
// };

// evh = jp;

// const greetGuitarist = (guitarist: guitarist) => {
//   return ` hello ${guitarist.name}`;
// };

// console.log(greetGuitarist(jp));

// // enums;
// enum Grade {
//   u = 1,
//   d,
//   c,
//   n,
//   a,
// }

// console.log(Grade.u);

// type stringOrNumber = string | number;

// type stringOrNumberArray = (string | number)[];
// type guitarist = {
//   name?: string;
//   active: boolean;
//   albums: (string | number)[];
// };

// type userId = stringOrNumber;

// //   litteral types

// let myName: "dave";

// let userName: "dave" | " john" | "daniel";
// userName = "daniel";

// // functions
// const addd = (a: number, b: number): number => {
//   return a + b;
// };

// const logMsg = (messadge: any): void => {
//   console.log(messadge);
// };

// logMsg(`hello`);
// // logMsg

// // optional parameters
// const addall = (a: number, b: number, C?: number): number => {
//   if (typeof C !== "undefined") {
//     return a + b + C;
//   }
//   return a + b;
// };

// // default params value
// const sumAll = (a: number, b: number, c: number = 2): number => {
//   return a + b + c;
// };

// // rest parameter
// const total = (a: number, ...nums: number[]): number => {
//   return a + nums.reduce((prev, curr) => prev + curr);
// };

// logMsg(total(1, 2, 3, 4));

// const createError = (errmsg: string) => {
//   throw new Error(errmsg);
// };

// // never type
// const infinite = () => {
//   let i: number = 1;
//   while (true) {
//     i++;
//     if (i > 100) break;
//   }
// };

// const isNumber = (value: any): boolean => {
//   return typeof value === "number" ? true : false;
// };
// // when never can be used

// const numberofstring = (value: number | string): string => {
//   if (typeof value === "string") return "string";
//   if (typeof value === "number") return "number ";
//   return createError(`this should never happend`);
// };

// type Assertion
// type One = string;
// type Two = string | number;
// type Three = `hello`;

// // what i can do with type asertion
// // convert to more or less specific
// let a: One = `hello`;
// let b = a as Two; //less specfic
// let c = a as Three; //more specific

// let d = <One>`world`;
// let e = <string | number>` world`;

// // when we can use assertion

// const addOrConcat = (
//   a: number,
//   b: number,
//   c: `add` | "concat",
// ): number | string => {
//   if (c === "add") return a + b;
//   return "" + a + b;
// };

// let myVal: string = addOrConcat(2, 2, "concat") as string;

// // EG2
// // becareful ts sees no problem - but a string is returned
// let nextVal: number = addOrConcat(2, 2, "concat") as number;

// 10 as string;
// 10 as unknown as string;

// // where assertion could be useful
// // 1
// // the Dom

// const img = document.querySelector("img") as HTMLImageElement;
// const myImg = document.getElementById("#img") as HTMLImageElement;
// const nextImg = <HTMLImageElement>document.getElementById("#img");

// img.src;

// myImg.src;

// class Coder {
//   secondLang!: string;
//   constructor(
//     public readonly name: string,
//     public music: string,
//     private age: number,
//     protected lang: string = "Typescript",
//   ) {
//     this.age = age;
//     this.name = name;
//     this.music = music;
//     this.lang = lang;
//   }
//   public getAge() {
//     return `hello i am ${this.age}`;
//   }
// }

// const Dave = new Coder("Dave", "rock", 42);
// console.log(Dave.getAge());
// // console.log(Dave.age);
// // console.log(Dave.lang);

// class Webdev extends Coder {
//   constructor(
//     public computer: string,
//     name: string,
//     age: number,
//     music: string,
//   ) {
//     super(name, music, age);
//     this.computer = computer;
//   }
//   public getLang() {
//     return ` i write ${this.lang}`;
//   }
// }

// const Daniel = new Webdev("mac", "daniel", 22, "lofi");
// console.log(Daniel.getLang());
// // console.log(Daniel.age);

// // /////////////////////////////////////////////

// // appling interface to a class
// interface Musician {
//   name: string;
//   instrument: string;
//   play(action: string): string;
// }

// class Guitarist implements Musician {
//   name: string;
//   instrument: string;
//   constructor(name: string, instrument: string) {
//     this.name = name;
//     this.instrument = instrument;
//   }

//   play(action: string) {
//     return `${this.name} ${action} the ${this.instrument}`;
//   }
// }

// const page = new Guitarist(`jimmy`, "guitar");
// console.log(page.play(`strums`));

// // /////////////////////////////////////////////////////////////

// class Peeps {
//   static count: number = 0;

//   static getCount(): number {
//     return Peeps.count;
//   }

//   public id: number;

//   constructor(public name: string) {
//     this.name = name;
//     this.id = ++Peeps.count;
//   }
// }

// const John = new Peeps(`john`);
// const Dan = new Peeps(`Dan`);
// const manchi = new Peeps(`manchi`);

// console.log(Peeps.count);
// console.log(Dan.id);
// // //////////////////////////

// class Bands {
//   private dataState: string[];

//   constructor() {
//     this.dataState = [];
//   }
//   public get data(): string[] {
//     return this.dataState;
//   }

//   public set data(value: string[]) {
//     if (Array.isArray(value) && value.every((el) => typeof el === "string")) {
//       this.dataState = value;
//       return;
//     } else throw new Error(`params is not an array`);
//   }
// }

// const MyBands = new Bands();
// MyBands.data = [`neil young`, `led yap`];
// console.log(MyBands.data);
// MyBands.data = [...MyBands.data, `zz top`];
// console.log(MyBands.data);
// MyBands.data = [`van halen`];

// index signature
// interface TransactionId {
//   pizza: number;
//   books: number;
//   job: number;
// }

// const todaysTransactions: TransactionId = {
//   pizza: -10,
//   books: -5,
//   job: 50,
// };

// console.log(todaysTransactions.pizza);
// console.log(todaysTransactions["pizza"]);

// const todaysNet = (transactions: TransactionId): number => {
//   let total = 0;
//   for (const transaction in transactions) {
//     total += transaction[transactions];
//   }
//   return total;
// };

// console.log(todaysNet(todaysTransactions));

// Type script generics
// const stringEcho = (arg:string):string => arg
// const Echo = <T>(arg: T): T => arg;

// const isObj = <T>(arg: T): boolean => {
//   return typeof arg === "object" && !Array.isArray(arg) && arg !== null;
// };
// console.log(isObj(true));
// console.log(isObj("john"));
// console.log(isObj([1, 2, 3]));
// console.log(isObj(null));

// const isTrue = <T>(arg: T): { arg: T; is: boolean } => {
//   if (Array.isArray(arg) && !arg.length) {
//     return { arg, is: false };
//   }
//   if (isObj(arg) && !Object.keys(arg as keyof T).length) {
//     return { arg, is: false };
//   }
//   return { arg, is: !!arg };
// };

// console.log(isTrue(false));
// console.log(isTrue(0));
// console.log(isTrue(true));
// console.log(isTrue(null));
// console.log(isTrue("john"));

// utility types
// interface Assignment {
//   studentId: string;
//   title: string;
//   grade: number;
//   verified?: boolean;
// }

// const
