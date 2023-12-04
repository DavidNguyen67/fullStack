import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Form } from 'react-bootstrap';
import instance from '../../utils/axios/customAxios';
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function Example() {
  const filePondRef = useRef<any>(null);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('female');
  const [avatar, setAvatar] = useState<any>(null);
  // const [preview, setPreview] = useState<any>();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // create a preview as a side effect, whenever selected file is changed
  // useEffect(() => {
  //   if (!avatar) {
  //     setPreview(undefined);
  //     return;
  //   }

  //   const objectUrl = URL.createObjectURL(avatar);
  //   setPreview(objectUrl);

  //   // free memory when ever this component is unmounted
  //   return () => URL.revokeObjectURL(objectUrl);
  // }, [avatar]);

  const handleSubmit = async () => {
    // console.log(avatar);
    // ! form now send data to server should be declare in FormData
    // ! it support file upload and string not number
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('gender', gender);
    avatar.length > 0 &&
      avatar.forEach((file: any) => formData.append('files', file.file));
    console.log(formData.get('files'));
    await instance.post('upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set proper content type for FormData
      },
    });

    handleClose();
  };

  const handleEmailChange = (e: any) => setEmail(e.target.value.trim());
  const handlePasswordChange = (e: any) => setPassword(e.target.value.trim());
  const handleGenderChange = (e: any) => setGender(e.target.value.trim());
  const handleAvatarChange = (e: any) => setAvatar(e.target.files[0]);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <PersonAddAlt1Icon />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicGender">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={gender}
                onChange={handleGenderChange}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              {/* <Form.Control type="file" onChange={handleAvatarChange} /> */}
              <FilePond
                ref={filePondRef}
                files={avatar}
                onupdatefiles={setAvatar}
                allowMultiple={true}
                maxFiles={3}
                // server="http://localhost:8080/api/v1/create"
                name="files"
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              />
            </Form.Group>
            {/* {avatar && <img src={preview} alt="" className="col-2" />} */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example;
