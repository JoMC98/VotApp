tun=`ifconfig | grep tun_VotApp | wc -l`
ip=`ifconfig | grep 192.168.210.1 | wc -l`

if [ $tun -gt 0 -a $ip -gt 0 ]; then
	echo "Apagando"
	cp ./openvpn/DNS/DNS_NORMAL /etc/resolv.conf 
	systemctl stop openvpn@VotApp
	killall node
else
	echo "Encendiendo"
	systemctl start openvpn@VotApp
	cp ./openvpn/DNS/DNS_VPN /etc/resolv.conf 
	node server.js
fi