import { NavigatorLockAcquireTimeoutError, createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://piazhwrekcgxbvsyqiwi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYXpod3Jla2NneGJ2c3lxaXdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzU3MjMxOCwiZXhwIjoyMDM5MTQ4MzE4fQ.Le7Ty4JcLhKfGDAjmc4h-1bQBJw3KCBUEIISv9oZ75I';

const supabase = createClient(supabaseUrl, supabaseKey);





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


const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permiso para acceder a la galería requerido');
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.cancelled) {
        const file = {
            uri: result.uri,
            type: result.type,
            name: result.uri.split('/').pop()
        };
        try {
            const uploadResult = await uploadImage(file); // Usa la función de carga de imágenes que ya has implementado
            if (uploadResult) {
                console.log('Imagen subida con éxito:', uploadResult);
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
        }
    }
};





export async function uploadImage(file) {
    // Asegúrate de que el archivo es una imagen
    if (!file || !file.uri || !file.uri.startsWith('file://')) {
        throw new Error('El archivo no es válido o no se puede determinar su tipo.');
    }

    // Nombre del archivo en el bucket
    const fileName = `${Date.now()}_${file.name}`;

    // Subir imagen a Supabase Storage
    const { data, error } = await supabase
        .storage
        .from('avatars') // Nombre del bucket
        .upload(`public/${fileName}`, file.uri, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
       
        throw new Error('Error al subir la imagen.');
    } else {
        
        return data; 
    }
    //https://piazhwrekcgxbvsyqiwi.supabase.co/storage/v1/object/public/avatars/spublic/1724913250856_IMG_8244.jpg
    //https://piazhwrekcgxbvsyqiwi.supabase.co/storage/v1/object/public/avatars/public/1724911482661_IMG_7454.jpg
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