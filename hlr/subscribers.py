from base64 import decode
import telnetlib
import time


def get_subscribers_list():
    t = telnetlib.Telnet("localhost", 4258)
    t.write(b"enable \r\n\r")
    t.write(b"show subscribers all \r\n\r")

    time.sleep(0.01)
    read = t.read_very_eager()
    subscribers = read.rsplit(b"NAM")[1].split(b"\r\n")[2:-4]
    subscribers = [subscriber.decode().split() for subscriber in subscribers]
    t.close()
    return subscribers


def get_subscribers_last_seen():
    t = telnetlib.Telnet("localhost", 4258)
    t.write(b"enable \r\n\r")
    t.write(b"show subscribers last-seen \r\n\r")
    time.sleep(0.01)
    read = t.read_very_eager()
    subscribers = read.rsplit(b"NAM")[1].split(b"\r\n")[2:-4]
    subscribers = [subscriber.decode().split() for subscriber in subscribers]
    t.close()
    return subscribers


def add_subscriber(imsi, msisdn):
    t = telnetlib.Telnet("localhost", 4258)
    t.write(b"enable \r\n\r")
    t.write(b"subscriber imsi " + imsi.encode() + b" create \r\n\r")
    t.write(b"subscriber imsi " + imsi.encode() + b" update msisdn " +
            msisdn.encode() + b" \r\n\r")
    time.sleep(0.1)
    read = t.read_very_eager()
    t.close()
    if read.find(b"Subscriber already exists") != -1:
        return {"status": "error", "message": "Subscriber already exists"}
    if read.find(b"Not a valid IMSI") != -1:
        return {"status": "error", "message": "Not a valid IMSI"}
    if read.find(b"MSISDN invalid") != -1:
        return {"status": "error", "message": "MSISDN invalid"}
    return {
        "status": "success",
        "message": "Subscriber added for imsi " + imsi
    }


def remove_subscriber(imsi):
    t = telnetlib.Telnet("localhost", 4258)
    t.write(b"enable \r\n\r")
    t.write(b"subscriber imsi " + imsi.encode() + b" delete \r\n\r")
    time.sleep(0.1)
    read = t.read_very_eager()
    t.close()
    if read.find(b"Subscriber does not exist") != -1:
        return {"status": "error", "message": "Subscriber does not exist"}
    return {
        "status": "success",
        "message": "Subscriber removed for imsi " + imsi
    }


def get_subscriber_info(imsi):
    t = telnetlib.Telnet("localhost", 4258)
    t.write(b"enable \r\n\r")
    t.write(b"show subscriber imsi " + imsi.encode() + b"\n")
    time.sleep(0.1)
    read = (t.read_very_eager().split(b"subscriber imsi " +
                                      imsi.encode())[1].split(b"\r\n")[1:-1])
    subscriber_info = [
        subscriber.decode().replace(": ", "=").replace(" ", "").replace(
            "(", "=").replace(")", "").split("=") for subscriber in read
    ]
    t.close()
    return subscriber_info


def update_subscriber_info(imsi, msisdn, imei, aud2g, ki, aud3g, k, op, opc):
    t = telnetlib.Telnet("localhost", 4258)
    t.write(b"enable \n")
    t.write(b"subscriber imsi " + imsi.encode() + b" update msisdn " +
            msisdn.encode() + b" \n")
    if imei == "":
        t.write(b"subscriber imsi " + imsi.encode() + b" update imei none \n")
    else:
        t.write(b"subscriber imsi " + imsi.encode() + b" update imei " +
                imei.encode() + b"\n")
    if aud2g == "none":
        t.write(b"subscriber imsi " + imsi.encode() + b" update aud2g none \n")
    elif ki == "":
        return {"status": "error", "message": "KI is required"}
    else:
        t.write(b"subscriber imsi " + imsi.encode() + b" update aud2g " +
                aud2g.encode() + b" ki " + ki.encode() + b"\n")
    if aud3g == "none":
        t.write(b"subscriber imsi " + imsi.encode() + b" update aud3g none \n")
    elif k == "":
        return {"status": "error", "message": "K is required"}
    elif aud3g == "xor":
        t.write(b"subscriber imsi " + imsi.encode() + b" update aud3g " +
                aud3g.encode() + b" k " + k.encode() + b"\n")
    elif op == "":
        t.write(b"subscriber imsi " + imsi.encode() + b" update aud3g " +
                aud3g.encode() + b" k " + k.encode() + b" opc " +
                opc.encode() + b"\n")
    elif opc == "":
        t.write(b"subscriber imsi " + imsi.encode() + b" update aud3g " +
                aud3g.encode() + b" k " + k.encode() + b" op " + op.encode() +
                b"\n")
    else:
        return {"status": "error", "message": "OP or OPC is required"}
    time.sleep(0.1)
    read = t.read_very_eager()
    print(read.decode())
    if read.find(b"MSISDN invalid") != -1:
        return {"status": "error", "message": "MSISDN invalid"}
    if read.find(b"IMEI invalid") != -1:
        return {"status": "error", "message": "IMEI invalid"}
    if read.find(b"Invalid value for KI") != -1:
        return {"status": "error", "message": "Invalid value for KI"}
    if read.find(b"Invalid value for K") != -1:
        return {"status": "error", "message": "Invalid value for K"}
    if read.find(b"cannot set 3G auth data") != -1:
        return {"status": "error", "message": "cannot set 3G auth data"}
    if read.find(b"cannot set 2G auth data") != -1:
        return {"status": "error", "message": "cannot set 2G auth data"}
    if read.find(b"Invalid value for OP") != -1:
        return {"status": "error", "message": "Invalid value for OP"}
    if read.find(b"Invalid value for OPC") != -1:
        return {"status": "error", "message": "Invalid value for OPC"}
    t.close()
    return {"status": "success", "message": "Subscriber updated"}
