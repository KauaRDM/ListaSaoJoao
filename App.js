import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Picker, Modal, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function App() {

  // Definindo os estados iniciais:
  const [selectedItem, setSelectedItem] = useState(''); // Estado para armazenar o item selecionado no Picker.
  const [quantity, setQuantity] = useState(''); // Estado para armazenar a quantidade do item.
  const [profitList, setProfitList] = useState([]); // Estado para armazenar a lista de lucros.
  const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false); // Estado para controlar a visibilidade do modal de confirmação de exclusão.
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState(null); // Estado para armazenar o índice do item a ser excluído.
  const [password, setPassword] = useState(''); // Estado para armazenar a senha de confirmação da exclusão.
  const [editModalVisible, setEditModalVisible] = useState(false); // Estado para controlar a visibilidade do modal de edição.
  const [editQuantity, setEditQuantity] = useState(''); // Estado para armazenar a nova quantidade do item a ser editado.
  const [editItemIndex, setEditItemIndex] = useState(null); // Estado para armazenar o índice do item a ser editado.
  const [editPassword, setEditPassword] = useState(''); // Estado para armazenar a senha de confirmação da edição.
  const [totalQuantity, setTotalQuantity] = useState(0); // Estado para armazenar o número total de produtos vendidos.

  // Quantidade total de faturamento de todos os produtos.
  useEffect(() => {
    const sum = profitList.reduce((total, item) => total + item.quantity, 0);
    setTotalQuantity(sum);
  }, [profitList]);

  useEffect(() => {
    const storedProfitList = localStorage.getItem('profitList');
    if (storedProfitList) {
      setProfitList(JSON.parse(storedProfitList));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('profitList', JSON.stringify(profitList));
  }, [profitList]);

  // Quantidade de produtos na lista tera um total no carrinho.
  useEffect(() => {
    const storedProfitList = localStorage.getItem('profitList');
    if (storedProfitList) {
      setProfitList(JSON.parse(storedProfitList));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('profitList', JSON.stringify(profitList));
  }, [profitList]);

  // Lista de itens disponiveis para seleção:
  const items = [
    { label: '🍷 Quentão Pequeno', value: '5', itemLabel: '🍷 Quentão Pequeno → R$5,00' },
    { label: '🍷 Quentão Médio', value: '10', itemLabel: '🍷 Quentão Médio → R$10,00' },
    { label: '🍷 Quentão Grande', value: '15', itemLabel: '🍷 Quentão Grande → R$15,00' },
    { label: '🍿 Pipoca Pequena', value: '3', itemLabel: '🍿 Pipoca Pequena → R$3,00' },
    { label: '🍿 Pipoca Média', value: '6', itemLabel: '🍿 Pipoca Média → R$6,00' },
    { label: '🍿 Pipoca Grande', value: '3', itemLabel: '🍿 Pipoca Grande → R$9,00' },
    { label: '🍰 Bolo', value: '4', itemLabel: '🍰 Bolo → R$4,00' },
    { label: '🥜 Pé de moleque', value: '3.50', itemLabel: '🥜 Pé de moleque → R$3,0' },
    { label: '🌭 Cachorro quente', value: '6.50', itemLabel: '🌭 Cachorro quente → R$6,50' },
  ];

  const handleAddProfit = () => {
    // Função para adicionar lucro à lista.
    if (selectedItem && quantity !== '') {
      const existingItem = profitList.find(item => item.item === selectedItem);
      if (existingItem) {
        // Se o item já existe na lista, atualiza a quantidade e o valor total.
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + parseInt(quantity),
          totalValue: existingItem.totalValue + parseInt(quantity) * parseFloat(selectedItem),
        };
        const updatedList = profitList.map(item => (item.item === selectedItem ? updatedItem : item));
        setProfitList(updatedList);
      } else {
        // Se o item não existe na lista, adiciona um novo item.
        const selectedItemObj = items.find(item => item.value === selectedItem);
        const newProfit = {
          item: selectedItem,
          itemName: selectedItemObj.label,
          quantity: parseInt(quantity),
          totalValue: parseInt(quantity) * parseFloat(selectedItem),
        };
        setProfitList([...profitList, newProfit]);
      }
      setSelectedItem('');
      setQuantity('');
    }
  };

  const openDeleteConfirmationModal = (index) => {
    // Abre o modal de confirmação de exclusão.
    setItemToDeleteIndex(index);
    setDeleteConfirmationModalVisible(true);
  };

  const closeDeleteConfirmationModal = () => {
    // Fecha o modal de confirmação de exclusão.
    setItemToDeleteIndex(null);
    setDeleteConfirmationModalVisible(false);
    setPassword('')
  };

  const handleDeleteProfit = () => {
    // Função para excluir um item da lista de lucros.
    if (password === '1234') {
      const newList = [...profitList];
      newList.splice(itemToDeleteIndex, 1);
      setProfitList(newList);
      closeDeleteConfirmationModal();
    } else {
      // Exibe um alerta se a senha estiver incorreta.
      Alert.alert('Senha incorreta!', 'A senha informada está incorreta. Por favor, tente novamente.');
    }
  };

  const calculateTotalProfit = () => {
    // Calcula o lucro total somando os valores totais de todos os itens da lista
    const total = profitList.reduce((sum, item) => sum + item.totalValue, 0);
    return total.toFixed(2);
  };

  const openEditModal = (index) => {
    // Abre o modal de edição
    setEditItemIndex(index);
    setEditModalVisible(true);
    setEditQuantity(profitList[index].quantity.toString());
    setEditPassword('');
  };

  const closeEditModal = () => {
    // Fecha o modal de edição
    setEditItemIndex(null);
    setEditModalVisible(false);
    setEditQuantity('');
    setEditPassword('');
  };

  const handleEditProfit = () => {
    // Função para editar um item da lista de lucros
    if (editPassword === '1234') {
      const updatedItem = {
        ...profitList[editItemIndex],
        quantity: parseInt(editQuantity),
        totalValue: parseInt(editQuantity) * parseFloat(profitList[editItemIndex].item),
      };
      const updatedList = [...profitList];
      updatedList[editItemIndex] = updatedItem;
      setProfitList(updatedList);
      closeEditModal();
    } else {
      // Exibe um alerta se a senha estiver incorreta
      Alert.alert('Senha incorreta!', 'A senha informada está incorreta. Por favor, tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🤠Lista de Lucros São João:</Text>
      <Text style={styles.eventDate}>06/07/2023 - Developed by: <Text style={{fontWeight: "bold"}}>Kauã</Text>, <Text style={{fontWeight: "bold"}}>Didio</Text> and <Text style={{fontWeight: "bold"}}>Daniel</Text>.</Text>

      <View style={styles.form}>
        <Picker
          style={styles.dropdown}
          selectedValue={selectedItem}
          onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}
        >
          <Picker.Item label="Selecione um item..." value="" />
          {items.map(item => (
            <Picker.Item key={item.value} label={item.itemLabel} value={item.value} />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          keyboardType="numeric"
          value={quantity}
          onChangeText={text => setQuantity(text)}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddProfit}>
          <Feather name="plus" size={24} color="white" />
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={profitList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.itemName}</Text>
            <Text style={styles.itemQuantity}>Quantidade: {item.quantity}</Text>
            <Text style={styles.itemQuantity}>Valor Total: R$ {item.totalValue.toFixed(2)}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(index)}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => openDeleteConfirmationModal(index)}>
              <Text style={styles.buttonText}>Apagar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.totalProfit}>🛒Quantidade: {totalQuantity}</Text>
      <Text style={styles.totalProfit}>💰Faturamento Total: R${calculateTotalProfit()}</Text>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteConfirmationModalVisible}
        onRequestClose={closeDeleteConfirmationModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Tem certeza de que deseja apagar este item?</Text>
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
              secureTextEntry
              value={password}
              onChangeText={text => setPassword(text)}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeDeleteConfirmationModal}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleDeleteProfit}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Editar quantidade:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nova Quantidade"
              keyboardType="numeric"
              value={editQuantity}
              onChangeText={text => setEditQuantity(text)}
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
              secureTextEntry
              value={editPassword}
              onChangeText={text => setEditPassword(text)}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleEditProfit}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 16,
    marginBottom: 16,
  },
  form: {
    marginBottom: 16,
  },
  dropdown: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 7,
  },
  input: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 7,
    paddingHorizontal: 8,
    height: 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 7,
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
  },
  item: {
    marginBottom: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemQuantity: {
    marginBottom: 4,
  },
  editButton: {
    backgroundColor: 'blue',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  totalProfit: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  passwordInput: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
    width: '100%',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
});
