import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { submitResetPassword } from 'app/auth/store/resetSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  new_password1: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  new_password2: yup.string().oneOf([yup.ref('new_password1'), null], 'Passwords must match'),
});

const defaultValues = {
  new_password1: '',
  new_password2: '',
};

function ResetPassword(props) {
  const dispatch = useDispatch();
  const authReset = useSelector(({ auth }) => auth.reset);

  const { control, formState, handleSubmit, reset, setError } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    authReset.errors.forEach((error) => {
      setError(error.type, {
        type: 'manual',
        message: error.message,
      });
    });
  }, [authReset.errors, setError]);

  function onSubmit(model) {
    const { uid, token } = props.match.params;
    model.uid = uid;
    model.token = token;
    dispatch(submitResetPassword(model));
  }

  return (
    <div className="flex flex-col flex-auto items-center justify-center p-16 sm:p-32">
      <div className="flex flex-col items-center justify-center w-full">
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-full max-w-384">
            <CardContent className="flex flex-col items-center justify-center p-16 sm:p-24 md:p-32">
              <img className="w-128 m-32" src="assets/images/logos/fuse.svg" alt="logo" />

              <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-24">
                Reset your password
              </Typography>

              <form
                name="resetForm"
                noValidate
                className="flex flex-col justify-center w-full"
                onSubmit={handleSubmit(onSubmit)}
              >

                <Controller
                  name="new_password1"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-16"
                      label="Password"
                      type="password"
                      name="new_password1"
                      error={!!errors.new_password1}
                      helperText={errors?.new_password1?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="new_password2"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-16"
                      label="Password (Confirm)"
                      type="password"
                      error={!!errors.new_password2}
                      helperText={errors?.new_password2?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />

                <Button
                  variant="contained"
                  color="primary"
                  className="w-224 mx-auto mt-16"
                  aria-label="Reset"
                  disabled={_.isEmpty(dirtyFields) || !isValid}
                  type="submit"
                >
                  Reset my password
                </Button>
              </form>

              <div className="flex flex-col items-center justify-center pt-32 pb-24">
                <Link className="font-normal" to="/login">
                  Go back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default ResetPassword;
