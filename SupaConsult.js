import { NavigatorLockAcquireTimeoutError, createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://vvpzqpmohxndkoxzdhbe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cHpxcG1vaHhuZGtveHpkaGJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTcwMzg4MywiZXhwIjoyMDE3Mjc5ODgzfQ.X0cQljiqVaGspiC6yWxlDy5oxPC-cjAkbG2rnqFSpp4';

const supabase = createClient(supabaseUrl, supabaseKey);






export async function obtenerUsserUid() {
    try {
        const usserUid = await AsyncStorage.getItem('usserUid');
        const id = usserUid;
        
        

        return usserUid;
    } catch (error) {
        console.error('Error al obtener usserUid:', error);
        return null;
    }
}






export async function LoginUsuario(email, password){

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert('Error al iniciar sesión: ' + error.message)
        
    } else {
        alert('Inicio de sesión exitoso: ')
        
        usserUid = data.user.id
        try {
            await AsyncStorage.setItem
            ('usserUid', usserUid)
        }
        catch (e) {
            alert(e)
        }
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
            .order('calificacion', { ascending: false})
        return data


    } catch (error) {
        throw error + 'siiii'
    }
}

