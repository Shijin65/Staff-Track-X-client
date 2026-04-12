import * as yup from "yup";

export const schema = yup
  .object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().optional(),
    email: yup.string().email("Invalid email").required("Email is required"),
    mobileNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    gender: yup.string().required("Gender is required"),
    role: yup.string().required("Role is required"),

    emergencyContact: yup
      .string()
      .matches(/^[0-9]{10}$/, { message: "Mobile number must be 10 digits", excludeEmptyString: true })
      .optional(),
    bloodGroup: yup.string().optional(),
    dateOfBirth: yup.string().optional(),
    address: yup.string().optional(),
    district: yup.string().optional(),
    city: yup.string().optional(),

    whiteShirt: yup.boolean().default(false),
    blackPant: yup.boolean().default(false),
    executiveBlackShoe: yup.boolean().default(false),
    grooming: yup.boolean().default(false),

    isActive: yup.boolean().default(true),
    verification: yup.boolean().default(false),

    profilePic: yup.string().optional(),
  })
  .required();
