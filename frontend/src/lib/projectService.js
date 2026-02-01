import { supabase } from "../supabase"; // Asegúrate de que apunte a tu configuración de Supabase

export const uploadProjectImage = async (file) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('image') // El nombre del Bucket que creaste en el Dashboard
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('image')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Error subiendo imagen:', error.message);
        return null;
    }
};

// También puedes agregar aquí la función para crear el proyecto en la DB
export const createProject = async (projectData) => {
    const { data, error } = await supabase
        .from('projects')
        .insert([projectData]);

    if (error) throw error;
    return data;
};