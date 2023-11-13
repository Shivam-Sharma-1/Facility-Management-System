import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { FC, FormEvent, MouseEvent, useEffect, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const ResetPasswordPage: FC = (): JSX.Element => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showOldPassword, setOldShowPassword] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const auth = useAuth();

  const mutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/auth/password`, data, {
        withCredentials: true,
      }),
    onError: (error) => {
      if (error.response) {
        const errorData = error.response.data as ErrorMessage;
        setError(errorData.error.message);
      }
      console.log(error);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    newPassword.length < 5 ? setIsError(true) : setIsError(false);
    if (!isError) {
      mutation.mutate({ oldPassword: oldPassword, newPassword: newPassword });
      auth?.logout();
    }
  };

  const handleClickShowPassword = (): void => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  const handleOldClickShowPassword = (): void =>
    setOldShowPassword((show) => !show);

  const handleOldMouseDownPassword = (
    event: MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  return (
    <div className="w-full h-full min-h-screen flex justify-center items-center">
      <div className="w-[500px] bg-bgPrimary shadow-cardHover rounded-lg flex flex-col justify-center p-10 gap-6">
        <Typography variant="h4" className="text-left">
          Admin password reset
        </Typography>
        <form
          autoComplete="off"
          className="flex flex-col gap-4"
          onSubmit={(e) => handleSubmit(e)}
        >
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">
              Old Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleOldClickShowPassword}
                    onMouseDown={handleOldMouseDownPassword}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Old Password"
              required
            />
            {error && <FormHelperText error={true}>{error}</FormHelperText>}
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-newpassword">
              New Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-newpassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="New Password"
              required
            />
            <FormHelperText error={isError}>
              The password must be minimum of 5 characters long
            </FormHelperText>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              minWidth: "40%",
              paddingBlock: "1em",
              marginTop: "1em",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            Confirm
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
