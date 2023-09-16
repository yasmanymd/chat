import { Box, FormControl, FormHelperText, TextField, TextFieldProps } from '@mui/material';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type IFormInputProps = {
  name: string;
} & TextFieldProps;

const FormInput: FC<IFormInputProps> = ({ name, ...otherProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box>
      <Controller control={control} name={name} render={({ field }) => (
        <TextField
          {...otherProps}
          {...field}
          error={!!errors.name}
        />
      )}
      />
      {errors[name] && (
        <FormHelperText sx={{ color: 'error.main' }} id='event-name-error'>
          {errors[name].message as string}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FormInput;