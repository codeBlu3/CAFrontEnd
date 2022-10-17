import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      MainDraw: {
        path: "main",
        screens: {
          Uploads: "uploads",
          Job: {
            path: "jobs",
            screens: {
              JobScreen: "joblist",
              //DpKdistanceSelectionScreen: {path:" dpkdistance/:jobID"}
              DpKdistanceSelectionScreen: "dpkdistance/:jobID",
              DpResultsScreen: "dpresult/:jobID",
            },
          },
          DedupeStack: {
            path: "dedupe",
            screens: {},
          },
          CrossMatchingStack: {
            path: "crossmatch",
            screens: {},
          },
        },
      },
      SignIn: "signin",
      SignUp: "signup",
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
