import * as Yup from 'yup';
import { Formik } from 'formik';
// mui
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from "@mui/material/Typography";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '@mui/lab/LoadingButton';
import FormHelperText from '@mui/material/FormHelperText';
// types
import { CREATE_ITEM, Discount, Items, ItemsVars } from '../../apollo/items';
import { useMutation } from '@apollo/client';

type CreateItemsProps = {
  discounts: Discount[];
  uploadImage: () => Promise<string | null>;
  resetImage: () => void;
}

function CreateItems({ discounts, uploadImage, resetImage }: CreateItemsProps) {

  const [createItems, { error }] = useMutation<
    { createItems: Items },
    { item: ItemsVars }
  >(CREATE_ITEM);
  
  return (
    <Formik
      initialValues={{
          itemCode: '',
          itemName: '',
          itemPrice: '',
          isAddon: false,
          discountCode: 'None',
          submit: null
      }}
      validationSchema={Yup.object().shape({
          itemCode: Yup.string().max(5).required("Item Code is required."),
          itemName: Yup.string().max(20).required("Item Name is required."),
          itemPrice: Yup.number().required("Item Price is required."),
          isAddon: Yup.boolean()
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
         try {
          const downloadURL = await uploadImage();
          if (downloadURL) {
            createItems({ variables: {
              item: {
                itemCode: values.itemCode,
                itemName: values.itemName,
                itemPrice: parseFloat(values.itemPrice),
                itemImage: downloadURL,
                isAddon: values.isAddon,
                discountCode: values.discountCode !== "None" ? values.discountCode : null,
              }
            }})

            setStatus({ success: false });
            setSubmitting(false);
            resetForm();
            resetImage();
          } else {
            setErrors({ submit: "Item image is required." });
          }
         } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: (err as Error).message });
          setSubmitting(false);
         }
      }}
  >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <Stack component="form" spacing={3} noValidate onSubmit={handleSubmit} sx={{ p: 3 }}>
          <TextField 
            value={values.itemCode}
            name="itemCode"
            onBlur={handleBlur}
            onChange={handleChange}
            label="Item Code"
            fullWidth
            error={Boolean(touched.itemCode && errors.itemCode)}
            helperText={Boolean(touched.itemCode && errors.itemCode) && errors.itemCode}
          />

          <TextField 
            value={values.itemName}
            name="itemName"
            onBlur={handleBlur}
            onChange={handleChange}
            label="Item Name"
            fullWidth
            error={Boolean(touched.itemName && errors.itemName)}
            helperText={Boolean(touched.itemName && errors.itemName) && errors.itemName}
          />

          <TextField 
            value={values.itemPrice}
            name="itemPrice"
            type="number"
            onBlur={handleBlur}
            onChange={handleChange}
            label="Item Price"
            fullWidth
            error={Boolean(touched.itemPrice && errors.itemPrice)}
            helperText={Boolean(touched.itemPrice && errors.itemPrice) && errors.itemPrice}
          />

           <FormControl fullWidth>
            <InputLabel>Discount</InputLabel>
            <Select
              name="discountCode"
              label="Discount"
              value={values.discountCode}
              onChange={handleChange}
              sx={{ color: (theme) => theme.palette.primary.main }}
            >
               <MenuItem value="None">
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {"None"}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {"₱ 0.00"}
                    </Typography>
                  </Stack>
                </MenuItem>
              {discounts.map((discount) => (
                <MenuItem key={discount.discCode} value={discount.discCode}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {discount.discCode}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {"₱ " + discount.discAmount.toFixed(2)}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel control={<Checkbox name="isAddon" value={values.isAddon} onChange={handleChange} />} label="This item is an addon." />
         
          {errors.submit && (
            <FormHelperText error>{errors.submit}</FormHelperText>
          )}

          {error && (
            <FormHelperText error>{error.message}</FormHelperText>
          )}

          <LoadingButton 
            disableElevation
            loading={isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="primary"
          >
            Add Item
          </LoadingButton>
        </Stack>
      )}
  </Formik>
  )
}

export default CreateItems