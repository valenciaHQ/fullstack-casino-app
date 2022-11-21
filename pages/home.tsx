import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import { Box, Button, Container, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Spinner, Tag } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';

export async function getServerSideProps() {
    try {
        await clientPromise
        // `await clientPromise` will use the default database passed in the MONGODB_URI
        // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
        //
        // `const client = await clientPromise`
        // `const db = client.db("myDatabase")`
        //
        // Then you can execute queries against your database like so:
        // db.find({}) or any of the MongoDB Node Driver commands

        return {
            props: { isConnected: true },
        }
    } catch (e) {
        console.error(e)
        return {
            props: { isConnected: false },
        }
    }
}
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home({
    isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [formError, setFormError] = useState(false)
    const [countryCodes, setCountryCodes] = useState("")
    const [countries, setCountries] = useState<Country[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const handleFormSubmimt = async (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (!countryCodes) {
            setFormError(true)
            return;
        }
        setFormError(false)
        setLoading(true)
        const response = await axios.get(`/api/countries?codes=${countryCodes}`)
        setCountries((response.data).map((item: Country) => item.name.common))
        setLoading(false)
    }
    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className="title">
                    Challenge
                </h1>
                <Container>
                    <FormControl as="form" onSubmit={handleFormSubmimt} isInvalid={formError}>
                        <FormLabel>Country codes</FormLabel>
                        <Input type='text' value={countryCodes} onChange={(e) => setCountryCodes(e.currentTarget.value)} />
                        {formError && (
                            <FormErrorMessage>
                                Enter at least one code before submit.
                            </FormErrorMessage>
                        )}
                        <FormHelperText>Separate codes with commas! Try with col,pe,at</FormHelperText>
                        <Button type='submit' colorScheme='teal' size='md' mt={2}>
                            Search countries
                        </Button>
                    </FormControl>
                    <Box mt={4}>
                        {loading ? <Spinner color='red.500' /> : countries.map(item => <Tag mr={4}>{item}</Tag>)}
                    </Box>
                </Container>
            </main>

            <footer>
                <p>footer</p>
            </footer>
        </div>
    )
}
