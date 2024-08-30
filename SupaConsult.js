import { NavigatorLockAcquireTimeoutError, createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://piazhwrekcgxbvsyqiwi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYXpod3Jla2NneGJ2c3lxaXdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzU3MjMxOCwiZXhwIjoyMDM5MTQ4MzE4fQ.Le7Ty4JcLhKfGDAjmc4h-1bQBJw3KCBUEIISv9oZ75I';

const supabase = createClient(supabaseUrl, supabaseKey);


export const uploadImage = async (fileBlob) => {
    try {
      const nameUnique = Date.now() + '-' + 'image.jpg'; // Usa un nombre genérico si no tienes el nombre del archivo
    
        // Subir el archivo al bucket 'actividades'
        const { data, error } = await supabase
            .storage
            .from('actividades')
            .upload(nameUnique, fileBlob, { contentType: 'image/jpeg' });
    
        if (error) {
            console.error('Error al subir el archivo a Supabase Storage:', error.message);
            throw error;
        }
    
        const imageUrl = `${supabase.storageUrl}/object/public/actividades/${nameUnique}`;
    
        return { path: imageUrl };
        } catch (error) {
        console.error('Error general:', error.message);
        throw new Error('Ocurrió un error al subir el archivo.');
        }
};






export async function login_Usser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert('Error al iniciar sesión: ' + error.message);
    } else {
        alert('Inicio de sesión exitoso');
        const userUid = data.user.id;
        await AsyncStorage.setItem('userUid', userUid);

        
        
        return { data: data };
    }
}




export async function fetch_Data(nomTB, datos, condicion) {
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

export async function create_User(email, password){
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    })
    if (error) {
        alert('Error al crear usuario')
    }

}



export async function insert_Data(nomTB, data){
    const { error } = await supabase
        .from(nomTB)
        .insert(data)
    if (error) {
        alert('Error al insertar datos')
    }

}

export async function delete_Data(nomTB, condicion){
    const { error } = await supabase
        .from(nomTB)
        .delete()
        .eq(condicion.campo, condicion.valor)
    if (error) {
        alert('Error al insertar datos')
    }

}


export async function close_Sesion(){
    const { error } = await supabase.auth.signOut()
}






export async function update_Data(nomTB, campoActualizar, nuevoValor, condicion) {
    try {
        const { error } = await supabase
            .from(nomTB) // Nombre de la tabla
            .update({ [campoActualizar]: nuevoValor }) // Actualiza el campo especificado con el nuevo valor
            .eq(condicion.campo, condicion.valor); // Condición para seleccionar el registro que se debe actualizar
        
        if (error) {
            throw error; // Lanza el error para que pueda ser capturado por el bloque catch
        } else {
            
        }
    } catch (error) {
        console.error('Error al actualizar los datos:', error.message);
        alert('Error al actualizar los datos.');
    }
}


