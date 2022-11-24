import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import InputContainer from '../components/ InputContainer';
import Loading from '../components/Loading';
import Game from '../components/Game';

export default function Home() {
    const router = useRouter()
    const [formError, setFormError] = useState(false)
    const [countryCodes, setCountryCodes] = useState<string>("")
    const [countries, setCountries] = useState<Country[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/login")
        }
    }, [router])

    const handleFormSubmit = async () => {
        if (!countryCodes) {
            setFormError(true)
            return;
        }
        setFormError(false)
        setLoading(true)
        const response = await api.get(`/api/countries?codes=${countryCodes}`)
        setCountries(response.data)
        setLoading(false)
    }
    return (
        <div>
            <Navbar />
            <main>
                <section className='flex flex-col bg-slate-200 text-black justify-evenly md:h-screen opacity-80'>
                    <div className='md:w-1/4 w-3/4 self-center bg-white p-4 mt-8 rounded-lg'>
                        <InputContainer>
                            <label className="">Countries</label>
                            <input placeholder="List of codes separated by comma" type='text' onChange={e => setCountryCodes(e.target.value)} value={countryCodes} />
                            <span>Query by country codes: try with col,pe,at</span>
                            {formError && <p>Set country codes</p>}
                            <button type="button" onClick={handleFormSubmit}>Search</button>
                        </InputContainer>
                        <div>
                            {loading ? <Loading /> : <div className='mt-4'>Results: {countries.map((item, i) => <span key={i} className='mr-2'>{item.name.common}</span>)}</div>}
                        </div>
                    </div>
                    <Game />
                </section>
            </main>

            <footer className='flex justify-center py-4 bg-teal-500'>
                <p>By <a className='text-white hover:opacity-80' href="www.valenciahq.com" target='_blank'>ValenciaHQ</a></p>
            </footer>
        </div>
    )
}
