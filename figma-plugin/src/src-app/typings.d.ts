declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*?worker&url" {
  const url: string;
  export default url;
}
declare module "*?worker" {
  const WorkerConstructor: { new (): Worker };
  export default WorkerConstructor;
}

declare module "*?worker&inline" {
  const Ctor: { new (): Worker };
  export default Ctor;
}
