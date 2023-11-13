import { FC, FormEvent, MouseEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginPage: FC = (): JSX.Element => {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const auth = useAuth();
  const navigate = useNavigate();

  const redirectPath = "/";

  const mutation = useMutation({
    mutationFn: (data: LoginData) =>
      axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/auth/login`, data, {
        withCredentials: true,
      }),
    onSuccess: (data) => {
      auth?.login(data.data);
      localStorage.setItem("token-info", JSON.stringify(data.data));
      navigate(redirectPath, { replace: true, preventScrollReset: true });
    },
    onError: (error) => {
      if (error.response) {
        const errorData = error.response.data as ErrorMessage;
        setError(errorData.error.message);
      }
      console.log(error);
    },
  });

  const handleClickShowPassword = (): void => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    password.length < 5 ? setIsError(true) : setIsError(false);
    !isError &&
      mutation.mutate({
        employeeId: parseInt(id! as string),
        password: password,
      });
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
      <div className="w-[450px] bg-bgPrimary shadow-cardHover rounded-lg flex flex-col justify-center p-10 gap-6">
        <Typography variant="h4" className="text-left">
          Employee Login
        </Typography>
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="flex flex-col gap-4"
        >
          <TextField
            id="id"
            label="Enter Employee ID"
            variant="outlined"
            className="w-full"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">
              Enter Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              label="Enter Password"
              required
            />
            <FormHelperText error={isError}>
              The password must be minimum of 5 characters long
            </FormHelperText>
            {error && (
              <FormHelperText error={true}>
                Invalid employee ID or password
              </FormHelperText>
            )}
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
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
