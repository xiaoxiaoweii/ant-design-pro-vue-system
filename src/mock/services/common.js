import Mock from 'mockjs2'
import { getQueryParameters } from '../util'

// const Random = Mock.Random

const equList = options => {
  const result = [
    {
      equCode: '211321001',
      equName: '敞开式岩石隧道掘进机（TBM）',
      equSpecs: '直径7930mm长度185',
      equModel: 'ZTT7930',
      equSortCode: '211321',
      equSortName: '岩石隧道掘进机（TBM）系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321002',
      equName: '敞开式岩石隧道掘进机（TBM）',
      equSpecs: '直径6530mm长度250',
      equModel: 'ZTT6530',
      equSortCode: '211321',
      equSortName: '岩石隧道掘进机（TBM）系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321003',
      equName: '敞开式岩石隧道掘进机（TBM）',
      equSpecs: '直径4030mm长度210',
      equModel: 'ZTT4030',
      equSortCode: '211321',
      equSortName: '岩石隧道掘进机（TBM）系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321004',
      equName: '单护盾岩石隧道掘进机（TBM）',
      equSpecs: '直径6880mm长度105',
      equModel: 'ZTT6880',
      equSortCode: '211321',
      equSortName: '岩石隧道掘进机（TBM）系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321005',
      equName: '单护盾岩石隧道掘进机（TBM）',
      equSpecs: '直径7620mm长度165',
      equModel: 'ZTT7620',
      equSortCode: '211321',
      equSortName: '岩石隧道掘进机（TBM）系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321006',
      equName: '双护盾岩石隧道掘进机（TBM）',
      equSpecs: '直径5490mm长度310',
      equModel: 'ZTT5490',
      equSortCode: '211321',
      equSortName: '岩石隧道掘进机（TBM）系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321007',
      equName: '土压平衡盾构机',
      equSpecs: '6000/5400mm',
      equModel: 'ZTE6250',
      equSortCode: '211322',
      equSortName: '盾构机系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321008',
      equName: '土压平衡盾构机',
      equSpecs: '6200/5500mm',
      equModel: 'ZTE6410',
      equSortCode: '211322',
      equSortName: '盾构机系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321009',
      equName: '土压平衡盾构机',
      equSpecs: '6600/5900mm',
      equModel: 'ZTE6830',
      equSortCode: '211322',
      equSortName: '盾构机系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321010',
      equName: '泥水平衡盾构机',
      equSpecs: '6000/5400mm',
      equModel: 'ZTS6250',
      equSortCode: '211322',
      equSortName: '盾构机系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321011',
      equName: '泥水平衡盾构机',
      equSpecs: '6200/5500mm',
      equModel: 'ZTS6410',
      equSortCode: '211322',
      equSortName: '盾构机系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '2113212',
      equName: '泥水平衡盾构机',
      equSpecs: '直径4030mm长度210',
      equModel: 'ZTS6830',
      equSortCode: '211322',
      equSortName: '盾构机系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321013',
      equName: '双模式盾构机',
      equSpecs: '6000/5400mm',
      equModel: 'ZTSE6250',
      equSortCode: '211322',
      equSortName: '盾构机系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321014',
      equName: '斜井单护盾岩石隧道掘进机',
      equSpecs: '直径7635mm长度180m',
      equModel: 'ZTT7635',
      equSortCode: '211323',
      equSortName: '矿用隧道掘进机系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321015',
      equName: '斜井双模式岩石隧道掘进机',
      equSpecs: '直径7620mm长度180',
      equModel: 'ZTTE7620',
      equSortCode: '211323',
      equSortName: '矿用隧道掘进机系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321016',
      equName: '敞开式岩石隧道掘进机（TBM）',
      equSpecs: '直径4030mm长度210',
      equModel: 'ZTT4030',
      equSortCode: '211323',
      equSortName: '岩石隧道掘进机（TBM）系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321017',
      equName: '管廊盾构机',
      equSpecs: '6000*4300/5000*3300mm',
      equModel: 'ZTJ6000',
      equSortCode: '211324',
      equSortName: '市政管道施工机械系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321018',
      equName: '敞开式岩石隧道掘进机（TBM）',
      equSpecs: '7000*5000/6000*4000mm',
      equModel: 'ZTJ7000',
      equSortCode: '211324',
      equSortName: '市政管道施工机械系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321019',
      equName: '小直径盾构机',
      equSpecs: '3500/3000mm',
      equModel: 'ZTE3730',
      equSortCode: '211324',
      equSortName: '市政管道施工机械系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321020',
      equName: '顶管机',
      equSpecs: '1000/800mm',
      equModel: 'ZTP1000',
      equSortCode: '211324',
      equSortName: '市政管道施工机械系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321021',
      equName: '顶管机',
      equSpecs: '1680/1640mm',
      equModel: 'ZTP1700',
      equSortCode: '211324',
      equSortName: '市政管道施工机械系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321022',
      equName: '顶管机',
      equSpecs: '2440/2000mm',
      equModel: 'ZTP2500',
      equSortCode: '211324',
      equSortName: '市政管道施工机械系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321023',
      equName: '顶管机',
      equSpecs: '3100/2600mm',
      equModel: 'ZTP3100',
      equSortCode: '211324',
      equSortName: '市政管道施工机械系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321024',
      equName: '顶管机',
      equSpecs: '3600/3000mm',
      equModel: 'ZTP3600',
      equSortCode: '211324',
      equSortName: '市政管道施工机械系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321025',
      equName: '顶管机',
      equSpecs: '4140/3500mmm',
      equModel: 'ZTP4200',
      equSortCode: '211324',
      equSortName: '市政管道施工机械系列',
      isEspecial: '0',
      note: ''
    },
    {
      equCode: '211321026',
      equName: 'ZYS/ZY系列凿岩台车',
      equSpecs: '15100x2500x3300',
      equModel: 'ZY（S）82',
      equSortCode: '211325',
      equSortName: '隧道机械化施工系列',
      isEspecial: '1',
      note: ''
    },
    {
      equCode: '211321027',
      equName: 'ZYS/ZY系列凿岩台车',
      equSpecs: '17600x2900x3600',
      equModel: 'ZY（S）113',
      equSortCode: '211325',
      equSortName: '隧道机械化施工系列',
      isEspecial: '1',
      note: ''
    },
    {
      equCode: '211321028',
      equName: '矿用凿岩台车',
      equSpecs: '4140/3500mmm',
      equModel: 'ZY61半智能一臂凿岩台车',
      equSortCode: '211325',
      equSortName: '隧道机械化施工系列',
      isEspecial: '1',
      note: ''
    },
    {
      equCode: '211321029',
      equName: '矿用凿岩台车',
      equSpecs: '4140/3500mmm',
      equModel: 'ZY62半智能一臂凿岩台车',
      equSortCode: '211325',
      equSortName: '隧道机械化施工系列',
      isEspecial: '1',
      note: ''
    },
    {
      equCode: '211321030',
      equName: '矿用凿岩台车',
      equSpecs: '4140/3500mmm',
      equModel: 'ZY41D全液压一臂中深孔凿岩台车',
      equSortCode: '211325',
      equSortName: '隧道机械化施工系列',
      isEspecial: '1',
      note: ''
    },
    {
      equCode: '211321031',
      equName: '矿用凿岩台车',
      equSpecs: '4140/3500mmm',
      equModel: 'ZY41全液压一臂凿岩台车',
      equSortCode: '211325',
      equSortName: '隧道机械化施工系列',
      isEspecial: '1',
      note: ''
    }
  ]
  const parameters = getQueryParameters(options)

  return {
    message: '',
    responseList: result.filter(equ => equ.equName.includes(parameters.equName)),
    status: 200
  }
}

const stationTree = () => {
  return {
    msg: '操作成功.',
    responseObject: {
      virtual: false,
      code: '0000100011',
      children: [
        {
          type: 1,
          id: 986437,
          name: '机关',
          code: '000010001101',
          order: 1,
          show: true,
          fullname: '机关',
          virtual: true,
          children: [
            {
              type: 2,
              id: 986540,
              name: '信息化管理部',
              code: '00001000110100077019',
              order: 39,
              virtual: false,
              children: [
                {
                  type: 2,
                  id: 1164566,
                  name: '基础平台处',
                  code: '0000100011010007701988003',
                  order: 11,
                  virtual: false,
                  children: [
                    {
                      type: 3,
                      id: 1164567,
                      name: '处长',
                      code: '0010001101000770198800399001',
                      order: 1
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      name: '中铁十一局',
      show: true,
      id: 1,
      fullname: '中铁十一局集团有限公司',
      type: 1,
      order: 1
    },
    status: '0'
  }
}

Mock.mock(/\/api\/equList/, 'get', equList)
Mock.mock(/\/api\/stationtree/, 'get', stationTree)
