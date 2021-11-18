import { Box, Heading, Text, Button, Link } from '@chakra-ui/react';
import NextLink from 'next/link'

export default function NotFound() {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading
                display="inline-block"
                as="h2"
                size="2xl"
                bg={"blue.400"}
                backgroundClip="text">
                404
            </Heading>
            <Text fontSize="18px" mt={3} mb={2}>
                Page Not Found
            </Text>
            <Text color={'gray.500'} mb={6}>
                The page you're looking for does not seem to exist
            </Text>


            

            <NextLink href="/">
                <Button
                    colorScheme="blue"
                    bg={"blue.400"}
                    _hover={{
                        bg: 'blue.300',
                    }}
                    color="white"
                    variant="solid">
                    Go to Home
                </Button>
            </NextLink>
        </Box>
    );
}