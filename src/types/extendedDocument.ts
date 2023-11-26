// export interface ExtendedDocument extends Document {
//   startViewTransition?: any;
// }

export interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
}

export interface ExtendedDocument extends Document {
  startViewTransition(setupPromise: () => Promise<void> | void): ViewTransition;
}