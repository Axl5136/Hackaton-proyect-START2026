export const mockProjects = [
    {
        id: 1,
        name: "Rancho San Miguel",
        location: "Guanajuato, MX",
        region: "Norte",
        technologyType: "drip_irrigation",
        technology: "Riego por Goteo",
        verificationLevel: "Muy alta",
        riskLevel: "low",
        projectedSavings: 15000,
        pricePerM3: 25.50,
        status: "available",
        badges: ["En tendencia", "Mejor valor"],
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 2,
        name: "Agroindustrial Del Valle",
        location: "Sinaloa, MX",
        region: "Norte",
        technologyType: "precision_ag",
        technology: "Agricultura de Precisión",
        verificationLevel: "Alta",
        riskLevel: "medium",
        projectedSavings: 30000,
        pricePerM3: 22.00,
        status: "available",
        badges: ["Alta verificación"],
        image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 3,
        name: "Finca La Esperanza",
        location: "Chiapas, MX",
        region: "Sur",
        technologyType: "rainwater_harvesting",
        technology: "Captación Pluvial",
        verificationLevel: "Media",
        riskLevel: "low",
        projectedSavings: 8000,
        pricePerM3: 18.75,
        status: "available",
        badges: ["Mejor impacto"],
        image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=2000&auto=format&fit=crop",
    },
    {
        id: 4,
        name: "Vinos de Baja",
        location: "Baja California, MX",
        region: "Norte",
        technologyType: "drip_irrigation",
        technology: "Riego por Goteo",
        verificationLevel: "Muy alta",
        riskLevel: "high",
        projectedSavings: 12500,
        pricePerM3: 28.00,
        status: "sold",
        purchasedQuantity: 12500,
        purchaseHash: "0x123abc...",
        badges: [],
        image: "https://images.unsplash.com/photo-1598155523122-38423bb4d6c3?q=80&w=2000&auto=format&fit=crop",
    },
];

export const regions = [
    "Norte",
    "Centro",
    "Sur",
    "Bajío",
    "Occidente"
];

export const technologies = [
    { value: "drip_irrigation", label: "Riego por Goteo" },
    { value: "precision_ag", label: "Agricultura de Precisión" },
    { value: "rainwater_harvesting", label: "Captación Pluvial" },
    { value: "wastewater_treatment", label: "Tratamiento de Aguas" }
];

export const verificationLevels = [
    "Muy alta",
    "Alta",
    "Media",
    "Básica"
];

export const sortOptions = [
    { value: "impact", label: "Mayor Impacto" },
    { value: "price", label: "Mejor Precio" },
    { value: "verification", label: "Nivel de Verificación" },
    { value: "recent", label: "Más Recientes" }
];
