import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Formulario } from "../components/Formulario";
import { InfoUser } from "../components/InfoUser";

export const Investment = () => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={5}>
          <Formulario />
        </Col>
        <Col md={{ span: 5, offset: 2 }}><InfoUser /></Col>
      </Row>
    </Container>
  );
};
