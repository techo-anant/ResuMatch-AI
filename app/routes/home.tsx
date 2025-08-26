import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import ResumeCard from "../components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import { useNavigate, Link} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuMatch" },
    { name: "description", content: "Get your dream job!" },
  ];
}

export default function Home() {
    const { auth, kv } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([])
    const [loadingResumes, setLoadingResumes] = useState(false)

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated]);

    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);

            const resumes = (await kv.list('resume:*', true)) as KVItem[];

            const parsedResumes = resumes?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))
            
            setResumes(parsedResumes || []);
            setLoadingResumes(false);
        }
        loadResumes();
    }, []);

    return <main className=" bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>

    <section className="main-section">
        <div className="page-heading py-16">
            <h1>Track Your Application & Resume Ratings</h1>
            {!loadingResumes && resumes.length === 0 ? (
                <h2>No resumes found. Upload your first resume to get feedback.</h2>
            ) :  (
                <h2>Review your submissions and check AI-powered feedback.</h2>
            )}
        </div>
        {loadingResumes && (
            <img src="/images/resume-scan-2.gif" alt="loading resumes" className="w-[200px]"/>
        )}
        {!loadingResumes && resumes.length > 0 && (
            <>
                <div className="resumes-section">
                    {resumes.map((resume) => (
                        <ResumeCard key={resume.id} resume={resume} />
                    ))}
                </div>
                <Link to='/wipe' className=" primary-button w-fit text-xl font-semibold">Wipe All Data</Link>
            </>
        )}

        {!loadingResumes && resumes.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10 gap-4 ">
                <Link to='/upload' className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
            </div>
        )}

    </section>
    </main>
}
