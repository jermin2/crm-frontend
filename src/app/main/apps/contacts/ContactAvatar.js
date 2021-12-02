import { Controller } from 'react-hook-form';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

function ContactAvatar( {control} ) {
  return (
    <Controller
      control={control}
      name="per_avatar"
      defaultValue=""
      render={({ field: { onChange, value } }) => (
        <>
          <input
            accept="image/*"
            id="avatar"
            type="file"
            onChange={(e) => {
              // upload the file
              // call onChange callback to change the value
              onChange(URL.createObjectURL(e.target.files[0]));
              const formData = new FormData();
              formData.append('avatar', e.target.files[0], e.target.files[0].filename);
              axios.post(`/api/contacts-app/avatar/`, formData).then((result) => {
                onChange(result.data.avatar);
              });
            }}
            hidden
          />
          <label htmlFor="avatar">
            <Button component="span">
              <Avatar className="w-96 h-96" alt="contact avatar" src={value} />
            </Button>
          </label>
        </>
      )}
    />
  );
}

export default ContactAvatar;
