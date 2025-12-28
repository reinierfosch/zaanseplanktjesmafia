#!/bin/bash
# DNS Propagation Test Script voor plankjesmaffia.nl

DOMAIN="plankjesmaffia.nl"
EXPECTED_IP="46.202.156.148"  # Hostinger IP
WWW_DOMAIN="www.plankjesmaffia.nl"

echo "🔍 DNS Propagation Test voor $DOMAIN"
echo "=================================="
echo ""

# Test hoofddomein
echo "📋 Test 1: $DOMAIN"
CURRENT_IP=$(dig +short $DOMAIN A | head -1)
if [ "$CURRENT_IP" = "$EXPECTED_IP" ]; then
    echo "✅ DNS correct: $DOMAIN → $CURRENT_IP"
else
    echo "❌ DNS nog niet correct: $DOMAIN → $CURRENT_IP (verwacht: $EXPECTED_IP)"
    echo "   ⏳ Wacht nog op DNS propagatie (kan 24-48 uur duren)"
fi
echo ""

# Test www subdomein
echo "📋 Test 2: $WWW_DOMAIN"
WWW_IP=$(dig +short $WWW_DOMAIN A | head -1)
if [ "$WWW_IP" = "$EXPECTED_IP" ]; then
    echo "✅ DNS correct: $WWW_DOMAIN → $WWW_IP"
else
    echo "❌ DNS nog niet correct: $WWW_DOMAIN → $WWW_IP (verwacht: $EXPECTED_IP)"
    echo "   ⏳ Wacht nog op DNS propagatie (kan 24-48 uur duren)"
fi
echo ""

# Test HTTPS
echo "📋 Test 3: HTTPS Connectiviteit"
if curl -s -o /dev/null -w "%{http_code}" --max-time 5 "https://$DOMAIN" | grep -q "200\|301\|302"; then
    echo "✅ HTTPS werkt: https://$DOMAIN"
else
    echo "❌ HTTPS werkt nog niet: https://$DOMAIN"
    echo "   💡 Mogelijk nog geen SSL certificaat of DNS niet gepropageerd"
fi
echo ""

# Test www HTTPS
if curl -s -o /dev/null -w "%{http_code}" --max-time 5 "https://$WWW_DOMAIN" | grep -q "200\|301\|302"; then
    echo "✅ HTTPS werkt: https://$WWW_DOMAIN"
else
    echo "❌ HTTPS werkt nog niet: https://$WWW_DOMAIN"
fi
echo ""

# DNS Servers check
echo "📋 Test 4: DNS Servers"
DNS_SERVERS=$(dig +short NS $DOMAIN)
if [ -n "$DNS_SERVERS" ]; then
    echo "✅ DNS Servers gevonden:"
    echo "$DNS_SERVERS" | while read server; do
        echo "   - $server"
    done
else
    echo "❌ Geen DNS servers gevonden"
fi
echo ""

# Summary
echo "=================================="
if [ "$CURRENT_IP" = "$EXPECTED_IP" ] && [ "$WWW_IP" = "$EXPECTED_IP" ]; then
    echo "✅ DNS is volledig geconfigureerd!"
    echo "🌐 Je kunt nu naar:"
    echo "   - https://$DOMAIN"
    echo "   - https://$WWW_DOMAIN"
else
    echo "⏳ DNS propagatie nog bezig..."
    echo "💡 Check over een paar uur opnieuw"
fi
echo ""

