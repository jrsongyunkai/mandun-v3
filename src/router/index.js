import VueRouter from 'vue-router'
export default new VueRouter({
  // mode: 'history',
  routes: [
    {
      path: '/Home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home'),
      meta: {
        title: 'Home'
      },
      children: [
        {
          path: '/Home',
          components: {
            default: () =>
              import(/* webpackChunkName: "home" */ '@/views/Main/Main'),
            rightSidebar: () =>
              import(
                /* webpackChunkName: "right" */ '@/views/Main/RightSidebar'
              )
          },
          meta: {
            title: 'Main',
            keepAlive: true
          },
          children: []
        },
        {
          name: 'System',
          path: '/system',
          component: () =>
            import(
              /* webpackChunkName: "configuration" */ '@/views/Configuration/System'
            ),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'News',
          path: '/News',
          component: () =>
            import(
              /* webpackChunkName: "configuration" */ '@/views/SiteNews/News'
            ),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'Overviews',
          path: '/Overview',
          component: () =>
            import(/* webpackChunkName: "Overview" */ '@/views/Home/Overview'),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'Electric',
          path: '/Electric',
          component: () =>
            import(/* webpackChunkName: "Electric" */ '@/views/Home/Electric'),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'Devices',
          path: '/Device',
          component: () =>
            import(/* webpackChunkName: "Devices" */ '@/views/Home/Devices'),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'ChannelList',
          path: '/ChannelList',
          component: () =>
            import(
              /* webpackChunkName: "ChannelList" */ '@/views/Home/ChannelList'
            ),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'Alarms',
          path: '/Alarm',
          component: () =>
            import(/* webpackChunkName: "Alarms" */ '@/views/Home/Alarm'),
          meta: {
            keepAlive: true
          }
        },
        {
          name: 'MaintenanceRecords',
          path: '/MaintenanceRecords',
          component: () =>
            import(
              /* webpackChunkName: "Alarms" */ '@/views/Control/MaintenanceRecords'
            ),
          meta: {
            keepAlive: false
          }
        },
        {
          path: '/Logs',
          component: () =>
            import(/* webpackChunkName: "Logs" */ '@/views/Logs/Logs'),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'ConfigurationList',
          path: '/ConfigurationList',
          component: () =>
            import(
              /* webpackChunkName: "ConfigurationList" */ '@/views/Control/ConfigurationList'
            ),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'LHydrologicalConfiguration',
          path: '/LHydrologicalConfiguration',
          component: () =>
            import(
              /* webpackChunkName: "LHydrologicalConfiguration" */ '@/views/Control/HydrologicalConfiguration'
            ),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'SmokeConfiguration',
          path: '/SmokeConfiguration',
          component: () =>
            import(
              /* webpackChunkName: "SmokeConfiguration" */ '@/views/Control/SmokeConfiguration'
            ),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'TemperatureHumidityConfiguration',
          path: '/TemperatureHumidityConfiguration',
          component: () =>
            import(
              /* webpackChunkName: "TemperatureHumidityConfiguration" */ '@/views/Control/TemperatureHumidityConfiguration'
            ),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'FlammableGasConfiguration',
          path: '/FlammableGasConfiguration',
          component: () =>
            import(
              /* webpackChunkName: "FlammableGasConfiguration" */ '@/views/Control/FlammableGasConfiguration'
            ),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'PHydrologicalConfiguration',
          path: '/PHydrologicalConfiguration',
          component: () =>
            import(
              /* webpackChunkName: "PHydrologicalConfiguration" */ '@/views/Control/HydrologicalConfiguration'
            ),
          meta: {
            keepAlive: false
          }
        },
        {
          name: 'StralsundConfiguration',
          path: '/StralsundConfiguration',
          component: () =>
            import(
              /* webpackChunkName: "StralsundConfiguration" */ '@/views/Control/StralsundConfiguration'
            ),
          meta: {
            keepAlive: false
          }
        },
        {
          path: '/InnerMain',
          components: {
            default: () =>
              import(
                /* webpackChunkName: "inner-main" */ '@/views/Main/InnerMain'
              ),
            rightSidebar: () =>
              import(
                /* webpackChunkName: "right" */ '@/views/Main/RightSidebar'
              )
          },
          meta: {
            title: 'InnerMain',
            keepAlive: false
          },
          children: [
            {
              path: 'Overview',
              component: () =>
                import(
                  /* webpackChunkName: "main-conrol" */ '@/views/Control/Overview'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              name: 'Wisefamily',
              path: 'Wisefamily',
              component: () =>
                import(
                  /* webpackChunkName: "main-conrol" */ '@/views/Wisefamily/WiseFamily'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'Warn',
              name: 'Warn',
              component: () =>
                import(/* webpackChunkName: "main-warn" */ '@/views/Warn/Warn'),
              meta: {
                title: 'Warn',
                keepAlive: true
              }
            },
            {
              path: 'Leakage',
              component: () =>
                import(
                  /* webpackChunkName: "main-leakage" */ '@/views/Leakage/Leakage'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'Temperature',
              component: () =>
                import(
                  /* webpackChunkName: "main-temperature" */ '@/views/Temperature/Temperature'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'LeakageW',
              component: () =>
                import(
                  /* webpackChunkName: "main-leakageW" */ '@/views/Leakage/LeakageW'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'LeakageA',
              component: () =>
                import(
                  /* webpackChunkName: "main-leakageA" */ '@/views/Leakage/LeakageA'
                ),
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'TemperatureW',
              component: () =>
                import(
                  /* webpackChunkName: "main-temperatureW" */ '@/views/Temperature/TemperatureW'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'ShortC',
              component: () =>
                import(
                  /* webpackChunkName: "main-shortC" */ '@/views/Short/ShortC'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'ShortW',
              component: () =>
                import(
                  /* webpackChunkName: "main-shortW" */ '@/views/Short/ShortW'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'OUvoltage',
              component: () =>
                import(
                  /* webpackChunkName: "main-OUvoltage" */ '@/views/OUvoltage/OUvoltage'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'Overload',
              component: () =>
                import(
                  /* webpackChunkName: "main-overload" */ '@/views/Overload/Overload'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'SparkingW',
              component: () =>
                import(
                  /* webpackChunkName: "main-sparkingW" */ '@/views/Sparking/SparkingW'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'ThreephaseW',
              component: () =>
                import(
                  /* webpackChunkName: "main-threephaseW" */ '@/views/Threephase/ThreephaseW'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'Power',
              component: () =>
                import(
                  /* webpackChunkName: "main-power" */ '@/views/Power/Power'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'Load',
              component: () =>
                import(/* webpackChunkName: "main-load" */ '@/views/Load/Load'),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'EnergyOverview',
              component: () =>
                import(
                  /* webpackChunkName: "main-load" */ '@/views/EnergyConsumption/Overview'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'SavingScheme',
              component: () =>
                import(
                  /* webpackChunkName: "main-load" */ '@/views/EnergyConsumption/SavingScheme'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'EnergyReport',
              component: () =>
                import(
                  /* webpackChunkName: "main-load" */ '@/views/EnergyConsumption/Report'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'EnergyManagement',
              component: () =>
                import(
                  /* webpackChunkName: "main-load" */ '@/views/EnergyConsumption/Management'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'EnergyFormula',
              component: () =>
                import(
                  /* webpackChunkName: "main-load" */ '@/views/EnergyConsumption/Formula'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'EnergyTrend',
              component: () =>
                import(
                  /* webpackChunkName: "main-load" */ '@/views/EnergyConsumption/Trend'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'EnergyComparison',
              component: () =>
                import(
                  /* webpackChunkName: "main-load" */ '@/views/EnergyConsumption/Comparison'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'EnergyConsumption',
              component: () =>
                import(
                  /* webpackChunkName: "main-load" */ '@/views/EnergyConsumption/Consumption'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'EnergyStatistics',
              component: () =>
                import(
                  /* webpackChunkName: "main-load" */ '@/views/EnergyConsumption/Statistics'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'EnergyAnalysis',
              component: () =>
                import(
                  /* webpackChunkName: "main-load" */ '@/views/EnergyConsumption/Analysis'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'Control',
              component: () =>
                import(
                  /* webpackChunkName: "main-conrol" */ '@/views/Control/Control'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              name: 'BuiltInTiming',
              path: 'BuiltInTiming',
              component: () =>
                import(
                  /* webpackChunkName: "main-conrol" */ '@/views/BuiltInTiming/List'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              name: 'RegionalRelations',
              path: 'RegionalRelations',
              component: () =>
                import(
                  /* webpackChunkName: "main-conrol" */ '@/views/RegionalRelations/RegionalRelations'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              name: 'LatitudeLongitudeTiming',
              path: 'LatitudeLongitudeTiming',
              component: () =>
                import(
                  /* webpackChunkName: "main-conrol" */ '@/views/LatitudeLongitudeTiming/LatitudeLongitudeTiming'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              name: 'BatchConfiguration',
              path: 'BatchConfiguration',
              component: () =>
                import(
                  /* webpackChunkName: "main-batchConfiguration" */ '@/views/BatchConfiguration/BatchConfiguration'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              name: 'DetectionRules',
              path: 'DetectionRules',
              component: () =>
                import(
                  /* webpackChunkName: "main-batchConfiguration" */ '@/views/DetectionRules/List'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'LinkageScene',
              component: () =>
                import(
                  /* webpackChunkName: "main-batchConfiguration" */ '@/views/BuiltInTiming/LinkageScene'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'AnalysisReport',
              component: () =>
                import(
                  /* webpackChunkName: "main-batchConfiguration" */ '@/views/AnalysisReport/AnalysisReport'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'Alarm',
              component: () =>
                import(
                  /* webpackChunkName: "main-alarm" */ '@/views/DeviceStatus/Alarm'
                ),
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'OpenCloseWarning',
              component: () =>
                import(
                  /* webpackChunkName: "main-OpenCloseWarning" */ '@/views/OpeningClosingWarning/List'
                ),
              meta: {
                keepAlive: true
              }
            }
          ]
        }
      ]
    },
    {
      path: '/',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
      meta: {
        title: 'Login'
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: () =>
        import(/* webpackChunkName: "notFound" */ '@/views/Common/NotFound')
    }
  ]
})
