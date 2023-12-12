import { Skeleton, Typography } from '@mui/material';
import { Container, Row } from 'react-bootstrap';

export default function FallbackComponent() {
  return (
    <Container>
      <Row>
        <Typography className="col-12 text-center">
          Loading
          <Skeleton />
        </Typography>
      </Row>
    </Container>
  );
}
