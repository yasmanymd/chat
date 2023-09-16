import { Avatar, Box, Button, Container, CssBaseline, Grid, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { TypeOf, z } from "zod";
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/form-input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const registerUserSchema = z.object({
  firstname: z.string().nonempty('First name is required'),
  lastname: z.string().nonempty('Last name is required'),
  email: z.string().nonempty('Email is required').email('Invalid email'),
  password: z.string().min(4, 'Password should be minimum 4 characters')
});
type RegisterInput = TypeOf<typeof registerUserSchema>;

export default function Register() {
  const defaultTheme = createTheme();

  const [isRegistering, setIsRegistering] = useState(false);

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerUserSchema)
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitSuccessful, errors, isDirty, isValid },
  } = methods;

  const onSubmitHandler: SubmitHandler<RegisterInput> = async (data) => {
    setIsRegistering(true);
    const resp = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password
      })
    });

    const json = await resp.json();
    if (!json.user) {
      toast("Email already in use!", { type: "error" });
      setIsRegistering(false);
      return null;
    }

    const respSignIn = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    });

    if (respSignIn.status === 200) {
      toast(`User ${data.firstname} ${data.lastname} was created succesfully.`, {
        type: "info",
        autoClose: 3000,
        closeButton: true,
        onClose: () => {
          window.location.replace('/');
        }
      });
    } else {
      setIsRegistering(false);
      toast("Problem sign in to the chat!", { type: "error" });
    }
  }
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <FormProvider {...methods}>
            <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate autoComplete='off' sx={{ mt: 1 }} width='100%'>
              <FormInput
                name="email"
                required
                fullWidth
                label="Email"
                autoFocus
                sx={{ mt: 2 }}
              />
              <FormInput
                name="firstname"
                required
                fullWidth
                label="First name"
                sx={{ mt: 2 }}
              />
              <FormInput
                name="lastname"
                required
                fullWidth
                label="Last name"
                sx={{ mt: 2 }}
              />
              <FormInput
                name="password"
                required
                fullWidth
                label="Password"
                type="password"
                sx={{ mt: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isDirty || !isValid || isRegistering}
                sx={{ mt: 2 }}
              >
                Create account
              </Button>
            </Box>
          </FormProvider>
          <Box sx={{ mt: 2 }}>
            <Grid container>
              <Grid item>
                <Link href="/login">
                  {"Already registered? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
}