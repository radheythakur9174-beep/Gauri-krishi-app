import React, { useState } from "react";
import { View, Text, Button, TextInput, FlatList } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function App() {
  const [customer, setCustomer] = useState("");
  const [mobile, setMobile] = useState("");
  const [items, setItems] = useState([]);
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");

  const addItem = () => {
    if (product && price) {
      setItems([...items, { name: product, price: parseFloat(price) }]);
      setProduct("");
      setPrice("");
    }
  };

  const total = items.reduce((sum, i) => sum + i.price, 0);

  const generatePDF = async () => {
    const html = `
      <h1 style="text-align:center;">गौरी कृषि सेवा केंद्र</h1>
      <p><b>ग्राहक:</b> ${customer}</p>
      <p><b>मोबाइल:</b> ${mobile}</p>
      <hr/>
      <table border="1" width="100%" style="border-collapse:collapse;">
        <tr>
          <th>सामान</th>
          <th>कीमत (₹)</th>
        </tr>
        ${items
          .map(
            (i) =>
              `<tr><td>${i.name}</td><td style="text-align:right;">${i.price}</td></tr>`
          )
          .join("")}
      </table>
      <h3 style="text-align:right;">कुल: ₹${total}</h3>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert("Sharing not available on this device");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 20 }}>
        🏬 गौरी कृषि सेवा केंद्र
      </Text>

      <TextInput
        placeholder="ग्राहक का नाम"
        value={customer}
        onChangeText={setCustomer}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <TextInput
        placeholder="मोबाइल नंबर"
        value={mobile}
        onChangeText={setMobile}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="सामान का नाम"
        value={product}
        onChangeText={setProduct}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <TextInput
        placeholder="कीमत (₹)"
        value={price}
        onChangeText={setPrice}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        keyboardType="numeric"
      />

      <Button title="➕ सामान जोड़ें" onPress={addItem} />

      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 16, marginTop: 5 }}>
            {item.name} - ₹{item.price}
          </Text>
        )}
      />

      <Text style={{ fontSize: 18, marginTop: 20 }}>कुल: ₹{total}</Text>

      <Button title="📄 PDF बनाएं और शेयर करें" onPress={generatePDF} />
    </View>
  );
        }
