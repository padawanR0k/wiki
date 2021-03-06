import { Box, ButtonGroup, Button, ButtonOutline, Text } from "@primer/components";
import React from "react";
import Seo from "gatsby-theme-primer-wiki/src/components/seo";
import { navigate } from 'gatsby';

const NotFoundPage = ({ data, location }) => { 
  return ( 
    <>
      <Seo post={{ title: "404: Not Found" }} />
      <Box 
        display="flex"
        flexDirection="column"
        minHeight="100vh" 
        bg="bg.primary"
        color="text.primary"
        justifyContent="center"
      > 
        <Box
          maxWidth="80rem"
          margin="auto"
          padding="4rem 6rem"
        >
          <Box
            borderColor="border.primary"
            borderWidth={1}
            borderStyle="solid"
            p={3}
          >
            <Text as='span' fontWeight="bold" color="text.primary">π§ 404: NOT_FOUND</Text>
            <Text as='span' ml={1}>νμ΄μ§λ₯Ό μ°Ύμ μ μμ΅λλ€.</Text>
            <Text as='p' mt={2}>νμ΄μ§κ° μ‘΄μ¬νμ§ μκ±°λ, νμ¬ μμ± μ€μΈ λ¬Έμμλλ€.</Text>
          </Box>
          <ButtonGroup display="block" my={2}>
            <Button onClick={() => navigate(-1)}>μ΄μ  νμ΄μ§λ‘</Button>
            <ButtonOutline onClick={() => navigate("/")}>μν€ νμΌλ‘ λμκ°κΈ°</ButtonOutline>
          </ButtonGroup>
        </Box>
      </Box>
    </>
  );
};

export default NotFoundPage;