"use client";

import React from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon
} from "@mui/icons-material";

import { useAxios } from "@/lib/hooks";
import { CustomButton, PasswordField } from "@/components/ui";
import { useToast } from "@/lib/store/useToastStore";

interface ChangePasswordProps {
  handleClose: () => void;
}

const ChangePassword = ({ handleClose }: ChangePasswordProps) => {
  const api = useAxios();
  const { setToast } = useToast();

  const passwordSchema = yup.object().shape({
    currentPassword: yup
      .string()
      .required("Required field, please enter your Current Password.")
      .min(7, "Must be 7 characters or more.")
      .test({
        name: "check-password",
        message: "Password does not match.",
        test: async (value) => {
          if (!value || value.length < 7) return false;
          try {
            const response = await api.post("/api/users/check-password", {
              password: value,
            });
            return response.status === 200;
          } catch (error) {
            console.error(error);
            return false;
          }
        },
      }),
    newPassword: yup
      .string()
      .required("Required field, please enter your New Password.")
      .min(7, "Must be 7 characters or more.")
      .test(
        "different-from-current",
        "The new password cannot be the same as the old password.",
        function (value) {
          const currentPassword = this.resolve(yup.ref("currentPassword"));
          if (!currentPassword) {
            return true;
          }
          return value !== currentPassword;
        }
      )
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
    confirmPassword: yup
      .string()
      .required("Required field, please confirm your New Password.")
      .oneOf([yup.ref("newPassword")], "Password does not match."),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldUnregister: true,
    resolver: yupResolver(passwordSchema) as any,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const body = {
        newPassword: data.newPassword,
      };

      const { status } = await api.post(`/api/users/change-password`, body);

      if (status === 200) {
        setToast({
          message: "Password Changed Successfully",
          type: "success",
          open: true,
        });
        handleClose();
      }
    } catch (error) {
      setToast({
        message: "Failed To Change Password",
        type: "error",
        open: true,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <h2 className="text-gray-600  text-sm font-semibold">
          Enter your current password&nbsp;
          <span style={{ color: "red" }}>*</span>
        </h2>
        <Controller
          name="currentPassword"
          control={control}
          render={({ field }) => (
            <div className="mb-0">
              <PasswordField
                {...field}
                id="currentPassword"
                size="small"
                placeholder="Current Password"
                variant="outlined"
                error={Boolean(errors?.currentPassword)}
              />
              <div className="flex mt-1 text-xs">
                {errors?.currentPassword && (
                  <span className="text-red-500">
                    {errors?.currentPassword?.message}
                  </span>
                )}
              </div>
            </div>
          )}
        />

        {/* New Password */}
        <h2 className="text-gray-600  text-sm font-semibold mt-2">
          Enter the new password&nbsp;
          <span style={{ color: "red" }}>*</span>
        </h2>
        <div>
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <div className="">
                <PasswordField
                  id="newPassword"
                  {...field}
                  size="small"
                  error={Boolean(errors?.newPassword)}
                  placeholder="New Password"
                  variant="outlined"
                />
                {errors?.newPassword && (
                  <div className="flex mt-1 text-xs">
                    <span className="text-red-500">
                      {errors?.newPassword?.message}
                    </span>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* Confirm Password */}
        <div className="mt-2">
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <div className=" ">
                <PasswordField
                  {...field}
                  id="confirmPassword"
                  size="small"
                  error={Boolean(errors?.confirmPassword)}
                  placeholder="Confirm Password"
                  variant="outlined"
                />
                <div className="flex mt-1 text-xs">
                  {errors?.confirmPassword && (
                    <span className="text-red-500">
                      {errors?.confirmPassword?.message}
                    </span>
                  )}
                </div>
              </div>
            )}
          />
          <div className="w-full p-2 bg-amber-50 text-gray-600 text-[11px] rounded-md mt-4 border border-amber-100">
            Password must contain at least 8 characters, a lowercase, an
            uppercase, a special character and a number.
          </div>
        </div>

        <div className="flex gap-3 items-center justify-end mt-6">
          <CustomButton
            variant="outlined"
            color="inherit"
            onClick={handleClose}
            startIcon={<XCircleIcon />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="contained"
            type="submit"
            startIcon={<CheckCircleIcon />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Save Password
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
