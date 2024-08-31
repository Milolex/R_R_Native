import { NavigatorLockAcquireTimeoutError, createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://piazhwrekcgxbvsyqiwi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYXpod3Jla2NneGJ2c3lxaXdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzU3MjMxOCwiZXhwIjoyMDM5MTQ4MzE4fQ.Le7Ty4JcLhKfGDAjmc4h-1bQBJw3KCBUEIISv9oZ75I';

const supabase = createClient(supabaseUrl, supabaseKey);


export const uploadImage = async (fileBlob) => {
    try {
        const nameUnique = Date.now() + '-' + 'image.jpg';
    
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
        return { success: false };
    } else {
        alert('Inicio de sesión exitoso');
        const userUid = data.user.id;
        await AsyncStorage.setItem('userUid', userUid);
        return { success: true, data: data };
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




export async function fetch_Data_mes(nomTB, datos, condicion) {
    try {
        const { data, error } = await supabase
            .from(nomTB)
            .select(datos)
            .eq(condicion.campo1, condicion.valor1)
            .eq(condicion.campo2, condicion.valor2)
            .eq(condicion.campo3, condicion.valor3)
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
            .from(nomTB)
            .update({ [campoActualizar]: nuevoValor }) 
            .eq(condicion.campo, condicion.valor); 
        
        if (error) {
            throw error; 
        }
    } catch (error) {
        console.error('Error al actualizar los datos:', error.message);
        alert('Error al actualizar los datos.');
    }
}


export async function reset_password(email) {
    try {
        let { data, error } = await supabase.auth.resetPasswordForEmail(email)
    } catch (error) {
        
        alert('Error al actualizar los datos.');
    }
}


export async function val_otp(email, token) {
    try {
        const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
        if (error) {
            console.error('Error al verificar OTP:', error.message);
            return false;
        }
        // Convertir ambos correos electrónicos a minúsculas para la comparación
        const providedEmail = email.toLowerCase();
        const returnedEmail = data.user.email.toLowerCase();

        if (returnedEmail === providedEmail) {
            return true;
        } else {
            console.log('El correo electrónico no coincide.');
            return false;
        }
    } catch (error) {
        console.error('Error al verificar OTP:', error.message);
        return false;
    }
}


export async function change_password(password) {
    try {
        
        await supabase.auth.updateUser({ password: password })
        console.log(password);
    } catch (error) {
        
        alert('Error al actualizar los datos.');
    }
}














