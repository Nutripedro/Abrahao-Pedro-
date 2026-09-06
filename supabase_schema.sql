-- SQL Schema for NutriSaaS
-- Run this in your Supabase SQL Editor to create the necessary tables

-- 1. PROFESSIONALS Table
CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Nutricionista',
    council_type TEXT NOT NULL,
    council_number TEXT NOT NULL,
    council_state TEXT NOT NULL,
    specialty TEXT NOT NULL,
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'ativo',
    prescriber_type TEXT NOT NULL DEFAULT 'nutricionista'
);

-- 2. PATIENTS Table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    professional_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    birth_date DATE,
    gender TEXT,
    objective TEXT,
    status TEXT NOT NULL DEFAULT 'Ativo',
    last_consultation TIMESTAMP WITH TIME ZONE
);

-- 3. MEAL PLANS Table
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    professional_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- 4. PRESCRIPTIONS Table
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    professional_id UUID REFERENCES auth.users(id) NOT NULL,
    content JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente'
);

-- 5. EXAM REQUISITIONS Table
CREATE TABLE IF NOT EXISTS public.exam_requisitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    professional_id UUID REFERENCES auth.users(id) NOT NULL,
    exams TEXT[] NOT NULL,
    notes TEXT
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_requisitions ENABLE ROW LEVEL SECURITY;

-- POLICIES for PROFESSIONALS
CREATE POLICY "Users can view their own profile" ON public.professionals
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.professionals
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.professionals
    FOR INSERT WITH CHECK (auth.uid() = id);

-- POLICIES for PATIENTS
CREATE POLICY "Professionals can view their own patients" ON public.patients
    FOR SELECT USING (auth.uid() = professional_id);

CREATE POLICY "Professionals can insert their own patients" ON public.patients
    FOR INSERT WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Professionals can update their own patients" ON public.patients
    FOR UPDATE USING (auth.uid() = professional_id);

CREATE POLICY "Professionals can delete their own patients" ON public.patients
    FOR DELETE USING (auth.uid() = professional_id);

-- Similar policies for other tables...
CREATE POLICY "Professionals can view their own meal plans" ON public.meal_plans
    FOR SELECT USING (auth.uid() = professional_id);
CREATE POLICY "Professionals can manage their own meal plans" ON public.meal_plans
    FOR ALL USING (auth.uid() = professional_id);

CREATE POLICY "Professionals can view their own prescriptions" ON public.prescriptions
    FOR SELECT USING (auth.uid() = professional_id);
CREATE POLICY "Professionals can manage their own prescriptions" ON public.prescriptions
    FOR ALL USING (auth.uid() = professional_id);

CREATE POLICY "Professionals can view their own exam requisitions" ON public.exam_requisitions
    FOR SELECT USING (auth.uid() = professional_id);
CREATE POLICY "Professionals can manage their own exam requisitions" ON public.exam_requisitions
    FOR ALL USING (auth.uid() = professional_id);
