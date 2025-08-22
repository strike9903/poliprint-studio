// Nova Poshta API Service
const NP_API_URL = 'https://api.novaposhta.ua/v2.0/json/';
const NP_API_KEY = process.env.NOVA_POSHTA_API_KEY || 'demo-api-key';

export interface NPCity {
  Ref: string;
  Description: string;
  DescriptionRu: string;
  Area: string;
  AreaDescription: string;
  Region: string;
  RegionDescription: string;
}

export interface NPWarehouse {
  Ref: string;
  SiteKey: string;
  Description: string;
  DescriptionRu: string;
  ShortAddress: string;
  ShortAddressRu: string;
  Phone: string;
  TypeOfWarehouse: string;
  Number: string;
  CityRef: string;
  CityDescription: string;
  Schedule: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
}

export interface NPDeliveryCalculation {
  AssessedCost: string;
  Cost: string;
  CostRedelivery: string;
  CostPack: string;
  TZone: string;
}

class NovaPoshtaService {
  private async makeRequest(modelName: string, calledMethod: string, methodProperties?: any) {
    try {
      const response = await fetch(NP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: NP_API_KEY,
          modelName,
          calledMethod,
          methodProperties: methodProperties || {}
        })
      });

      const data = await response.json();
      
      if (!data.success || data.errors?.length > 0) {
        throw new Error(data.errors?.[0] || 'Nova Poshta API error');
      }

      return data.data;
    } catch (error) {
      console.error('Nova Poshta API error:', error);
      throw error;
    }
  }

  // Поиск городов
  async searchCities(cityName: string, limit: number = 20): Promise<NPCity[]> {
    return this.makeRequest('Address', 'searchSettlements', {
      CityName: cityName,
      Limit: limit
    });
  }

  // Получение всех городов
  async getCities(): Promise<NPCity[]> {
    return this.makeRequest('Address', 'getCities');
  }

  // Получение отделений по городу
  async getWarehouses(cityRef: string, typeOfWarehouse?: string): Promise<NPWarehouse[]> {
    return this.makeRequest('Address', 'getWarehouses', {
      CityRef: cityRef,
      TypeOfWarehouseRef: typeOfWarehouse
    });
  }

  // Получение отделений по названию города
  async getWarehousesByCity(cityName: string): Promise<NPWarehouse[]> {
    const cities = await this.searchCities(cityName, 1);
    if (cities.length === 0) {
      throw new Error('City not found');
    }
    
    return this.getWarehouses(cities[0].Ref);
  }

  // Расчет стоимости доставки
  async calculateDelivery(params: {
    citySender: string;
    cityRecipient: string;
    weight: number;
    serviceType: string;
    cost: number;
    cargoType?: string;
    seatsAmount?: number;
  }): Promise<NPDeliveryCalculation> {
    const result = await this.makeRequest('InternetDocument', 'getDocumentPrice', {
      CitySender: params.citySender,
      CityRecipient: params.cityRecipient,
      Weight: params.weight,
      ServiceType: params.serviceType,
      Cost: params.cost,
      CargoType: params.cargoType || '1',
      SeatsAmount: params.seatsAmount || '1'
    });

    return result[0];
  }

  // Создание интернет-документа
  async createInternetDocument(params: {
    payerType: string;
    paymentMethod: string;
    dateTime: string;
    cargoType: string;
    weight: number;
    serviceType: string;
    seatsAmount: number;
    description: string;
    cost: number;
    citySender: string;
    cityRecipient: string;
    senderAddress: string;
    recipientAddress: string;
    contactSender: string;
    sendersPhone: string;
    contactRecipient: string;
    recipientsPhone: string;
  }) {
    return this.makeRequest('InternetDocument', 'save', params);
  }

  // Отслеживание отправки
  async trackDocument(documentNumber: string) {
    return this.makeRequest('TrackingDocument', 'getStatusDocuments', {
      Documents: [{ DocumentNumber: documentNumber }]
    });
  }

  // Получение типов складов
  async getWarehouseTypes() {
    return this.makeRequest('Address', 'getWarehouseTypes');
  }

  // Получение типов груза
  async getCargoTypes() {
    return this.makeRequest('Common', 'getCargoTypes');
  }

  // Получение видов оплаты
  async getPaymentForms() {
    return this.makeRequest('Common', 'getPaymentForms');
  }

  // Получение типов плательщиков
  async getTypesOfPayers() {
    return this.makeRequest('Common', 'getTypesOfPayers');
  }
}

// Экспорт единого экземпляра сервиса
export const novaPoshtaService = new NovaPoshtaService();

// Mock данные для разработки (если API ключ не настроен)
export const mockNovaPoshtaData = {
  cities: [
    { Ref: 'kyiv-ref', Description: 'Київ', DescriptionRu: 'Киев', Area: 'kyiv-area', AreaDescription: 'Київська область', Region: 'kyiv-region', RegionDescription: 'Київська область' },
    { Ref: 'kharkiv-ref', Description: 'Харків', DescriptionRu: 'Харьков', Area: 'kharkiv-area', AreaDescription: 'Харківська область', Region: 'kharkiv-region', RegionDescription: 'Харківська область' },
    { Ref: 'odesa-ref', Description: 'Одеса', DescriptionRu: 'Одесса', Area: 'odesa-area', AreaDescription: 'Одеська область', Region: 'odesa-region', RegionDescription: 'Одеська область' },
    { Ref: 'lviv-ref', Description: 'Львів', DescriptionRu: 'Львов', Area: 'lviv-area', AreaDescription: 'Львівська область', Region: 'lviv-region', RegionDescription: 'Львівська область' },
    { Ref: 'dnipro-ref', Description: 'Дніпро', DescriptionRu: 'Днепр', Area: 'dnipro-area', AreaDescription: 'Дніпропетровська область', Region: 'dnipro-region', RegionDescription: 'Дніпропетровська область' }
  ],
  warehouses: [
    {
      Ref: 'warehouse-1',
      SiteKey: '1',
      Description: 'Відділення №1: вул. Хрещатик, 1',
      ShortAddress: 'вул. Хрещатик, 1',
      Phone: '0800-500-609',
      TypeOfWarehouse: 'Office',
      Number: '1',
      Schedule: {
        Monday: '08:00-21:00',
        Tuesday: '08:00-21:00',
        Wednesday: '08:00-21:00',
        Thursday: '08:00-21:00',
        Friday: '08:00-21:00',
        Saturday: '09:00-18:00',
        Sunday: '09:00-18:00'
      }
    },
    {
      Ref: 'warehouse-2',
      SiteKey: '2',
      Description: 'Відділення №2: вул. Дмитрівська, 10',
      ShortAddress: 'вул. Дмитрівська, 10',
      Phone: '0800-500-609',
      TypeOfWarehouse: 'Office',
      Number: '2',
      Schedule: {
        Monday: '08:00-21:00',
        Tuesday: '08:00-21:00',
        Wednesday: '08:00-21:00',
        Thursday: '08:00-21:00',
        Friday: '08:00-21:00',
        Saturday: '09:00-18:00',
        Sunday: 'Вихідний'
      }
    }
  ]
};