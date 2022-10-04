import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      MaindDraw: {
        path: "main",
        screens: {
	Uploads: 'uploads',
      DedupeStack: {
        path: "dedupe",
        screens: {},
      },
 

	},
      },
      SignIn: "signin",
      SignUp: "signup",
      NotFound: "*",
    },
  },
};

/*
      DedupeStack: {
        path: "dedupe",
        screens: {},
      },
      CrossmatchingStack: {
        path: "crossmatch",
        screens: {},
      },
  UploadStack: {
        path: "dedupe",
        screens: {},
      },
     


*/
