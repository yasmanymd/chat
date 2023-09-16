import { Avatar, Box, Button, Container, CssBaseline, Grid, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { TypeOf, z } from "zod";
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/form-input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const loginSchema = z.object({
  email: z.string().nonempty('Email is required').email('Invalid email'),
  password: z.string().min(4, 'Password should be minimum 4 characters')
});
type LoginInput = TypeOf<typeof loginSchema>;

export default function Login() {
  const defaultTheme = createTheme();

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const {
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<LoginInput> = async (data) => {
    const resp = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    });
    if (resp.status === 200) {
      window.location.replace('/');
    } else {
      toast("Credentials do not match!", { type: "error" });
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
            Sign in
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
                sx={{ mt: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </FormProvider>
          <Box sx={{ mt: 2 }}>
            <Grid container>
              <Grid item>
                <Link href="/register">
                  {"Don't have an account? Sign Up"}
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