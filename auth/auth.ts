export const lTokenTransform = (prevState: any, action: any) => {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...prevState,
        //        userToken: action.token,
        isLoading: false,
      };
    case "SIGN_IN":
      return {
        ...prevState,
        isSignout: true,
        //        userToken: action.token,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        isSignout: true,
        //        userToken: null,
      };
  }
};

export const initialTokenState = {
  isLoading: true,
  isSignout: false,
  //  userToken: null,
};
