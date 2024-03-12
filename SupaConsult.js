import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://vvpzqpmohxndkoxzdhbe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cHpxcG1vaHhuZGtveHpkaGJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTcwMzg4MywiZXhwIjoyMDE3Mjc5ODgzfQ.X0cQljiqVaGspiC6yWxlDy5oxPC-cjAkbG2rnqFSpp4';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function LoginUsuario(email, password){

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert('Error al iniciar sesión: ' + error.message)
        
    } else {
        alert('Inicio de sesión exitoso: ')
        

        return {data: data}
    }
}

export async function CrearUsuario(email, password){
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    })
    if (error) {
        alert('Error al crear usuario')
    }else {
        alert('Usuario '+email+' fue creado correctamente')

    }
}

export async function insertData(nomTB, data){
    const { error } = await supabase
        .from(nomTB)
        .insert(data)
    if (error) {
        alert('Error al insertar datos')
    }else {
        alert('Datos insertados correctamente')
    }

}

export async function fetchData(nomTB, datos, condicion) {
    try {
        const { data, error } = await supabase
            .from(nomTB)
            .select(datos)
            .eq(condicion.campo, condicion.valor)
        return data


    } catch (error) {
        throw error + 'siiii'
    }
}