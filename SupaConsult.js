import { NavigatorLockAcquireTimeoutError, createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://piazhwrekcgxbvsyqiwi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYXpod3Jla2NneGJ2c3lxaXdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzU3MjMxOCwiZXhwIjoyMDM5MTQ4MzE4fQ.Le7Ty4JcLhKfGDAjmc4h-1bQBJw3KCBUEIISv9oZ75I';

const supabase = createClient(supabaseUrl, supabaseKey);






export async function get_UsserUid() {
    try {
        const usserUid = await AsyncStorage.getItem('usserUid');
        const id = usserUid;
        
        

        return usserUid;
    } catch (error) {
        console.error('Error al obtener usserUid:', error);
        return null;
    }
}



export async function login_Usser(email, password){

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert('Error al iniciar sesión: ' + error.message);
    } else {
        alert('Inicio de sesión exitoso');
        const userUid = data.user.id;
        
        try {
            await AsyncStorage.setItem('userUid', userUid);   
            
        } catch (e) {
            alert('Error al guardar en AsyncStorage: ' + e.message);
        }
    
        return { data: data };
    }
    
}

export async function fetch_Data(nomTB, datos, condicion) {
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
/*
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

*/