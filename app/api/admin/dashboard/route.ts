import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { productosRespuesta } from '../../_comun/proyecciones';
import { errorDeDominio, exigirAdmin } from '../../_comun/respuestas';

export const dynamic = 'force-dynamic';

/**
 * `GET /api/admin/dashboard`
 *
 * Devuelve las métricas ya calculadas en el servidor. El panel no debe
 * sumar 35 productos en el navegador: el cálculo es del dominio y además las
 * cifras coinciden con lo que ve la interfaz.
 */
export async function GET(): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  try {
    const metricas = await serviciosServidor().dashboard.metricas();
    return NextResponse.json({
      metricas: {
        totalMesVentas: metricas.totalMesVentas.valor,
        totalPedidosMes: metricas.totalPedidosMes,
        valorTotalInventario: metricas.valorTotalInventario.valor,
        totalUnidadesStock: metricas.totalUnidadesStock,
        productosCriticos: productosRespuesta(metricas.productosCriticos),
      },
    });
  } catch (fallo) {
    return errorDeDominio(fallo);
  }
}