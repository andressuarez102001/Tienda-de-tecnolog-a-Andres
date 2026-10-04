import { NextResponse } from 'next/server';
import { serviciosServidor } from '@/application/serverCompositionRoot';
import { pedidoRespuesta } from '../../../../_comun/proyecciones';
import { cuerpoObjeto, entero, ErrorDePeticion, leerJson, opcion } from '../../../../_comun/validacion';
import { errorDeDominio, exigirAdmin } from '../../../../_comun/respuestas';
import { OrderStatus } from '@/domain/shared/enums';

export const dynamic = 'force-dynamic';

type Contexto = { params: Promise<{ id: string }> };

/**
 * `PATCH /api/admin/pedidos/[id]/estado`
 *
 * El destino se valida contra el enum y la transición se aplica en el
 * dominio, que es quien sabe si es legal. Un servidor que aceptara cualquier
 * estado devolvería 200 y dejaría el pedido en un estado imposible.
 */
export async function PATCH(peticion: Request, contexto: Contexto): Promise<NextResponse> {
  const sinPermiso = await exigirAdmin();
  if (sinPermiso) {
    return sinPermiso;
  }
  const { id } = await contexto.params;
  try {
    const datos = cuerpoObjeto(await leerJson(peticion));
    const destino = opcion(datos, 'estado', Object.values(OrderStatus));
    const pedido = await serviciosServidor().pedidos.cambiarEstado(
      entero({ id }, 'id', { minimo: 1 }),
      destino,
    );
    return NextResponse.json({ pedido: pedidoRespuesta(pedido) });
  } catch (fallo) {
    if (fallo instanceof ErrorDePeticion) {
      return NextResponse.json({ error: 'Petición inválida', detalle: fallo.message }, { status: 400 });
    }
    return errorDeDominio(fallo);
  }
}