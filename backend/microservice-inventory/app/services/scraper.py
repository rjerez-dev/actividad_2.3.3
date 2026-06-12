import requests

SHOPIFY_URL = "https://okwu.cl/collections/labiales/products.json"

def fetch_and_normalize_products():
    try:
        # Consumir la API externa con un timeout de 10 segundos
        response = requests.get(SHOPIFY_URL, timeout=10)

        if response.status_code != 200:
            return {"status": "error", "message": f"Error en proveedor: {response.status_code}", "data": []}

        data = response.json()
        raw_products = data.get("products", [])
        normalized_products = []

        for prod in raw_products:
            variants = prod.get("variants", [])
            first_variant = variants[0] if variants else {}

            precio_oferta = first_variant.get("price")
            precio_regular = first_variant.get("compare_at_price")

            if not precio_regular:
                precio_regular = precio_oferta
                precio_oferta = None

            lista_variantes = [
                {
                    "id_variante": v.get("id"),
                    "nombre_variante": v.get("title"),
                    "stock": v.get("inventory_quantity", 0) if v.get("inventory_quantity") is not None else 0
                }
                for v in variants
            ]

            stock_total = sum(v["stock"] for v in lista_variantes)
            images = prod.get("images", [])

            product_structure = {
                "id_producto": prod.get("id"),
                "nombre": prod.get("title"),
                "precio_regular": precio_regular,
                "precio_oferta": precio_oferta,
                "stock_total": stock_total,
                "disponibilidad": stock_total > 0,
                "url_imagen": images[0].get("src") if images else None,
                "variantes": lista_variantes
            }
            normalized_products.append(product_structure)

        return {
            "status": "success",
            "total": len(normalized_products),
            "data": normalized_products
        }

    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "message": "Fallo de conexión con la fuente externa.",
            "details": str(e),
            "data": []
        }