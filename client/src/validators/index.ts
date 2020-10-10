import * as Yup from "yup";

const stringReq = (min:number, max:number) =>
  Yup.string()
    .min(min, `Please enter at least ${min} characters`)
    .max(max, `Please enter at most ${max} characters`)
    .required("Required");

export const emailSchema = Yup.object().shape({
  email: Yup.string().email().required("Please insert a valid email address"),
});
export const passwordSchema = Yup.object().shape({
  password: stringReq(4, 30),
});

export const signupSchema = Yup.object().shape({
  username: stringReq(2, 30),
  password: stringReq(4, 30),
  email: Yup.string().email().required("Please insert a valid email address"),
});
export const loginSchema = Yup.object().shape({
  username: stringReq(2, 30),
  password: stringReq(4, 30),
});
