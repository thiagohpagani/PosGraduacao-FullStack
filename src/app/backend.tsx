export interface IDespesas {
    id: number;
    descricao: string;
    categoria: string;
    valor: number;
    mes: string;
    dia: string;

}

// Function to get despesas from endpoint
export function getDespesasEndpoint(): Promise<IDespesas[]> {
 // Fetch request to get despesas from endpoint
 return fetch("http://localhost:3001/despesas").then(resp => {
    // Return despesas as json
    return resp.json();
 });
}
